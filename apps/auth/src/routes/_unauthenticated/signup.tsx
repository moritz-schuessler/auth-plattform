import { useCallback } from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import { Button, buttonVariants } from "@auth-plattform/ui/components/button"
import { cn } from "@auth-plattform/ui/lib/utils"

import { authClient } from "@/lib/auth/client/auth-client"
import { auth } from "@/lib/auth/server/auth"

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string(),
})

const register = createServerFn({ method: "POST" })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    const context = await auth.$context
    const { minPasswordLength, maxPasswordLength } = context.password.config

    if (data.password.length < minPasswordLength) {
      throw new Error(
        `Use a password with at least ${minPasswordLength} characters.`
      )
    }

    if (data.password.length > maxPasswordLength) {
      throw new Error(
        `Use a password with at most ${maxPasswordLength} characters.`
      )
    }

    const password = await context.password.hash(data.password)
    const found = await context.internalAdapter.findUserByEmail(data.email, {
      includeAccounts: true,
    })

    if (
      !found ||
      found.accounts.some((account) => account.providerId === "credential")
    ) {
      throw new Error("This email can't be used to create an account.")
    }

    await context.internalAdapter.linkAccount({
      userId: found.user.id,
      accountId: found.user.id,
      providerId: "credential",
      password,
    })
  })

export const Route = createFileRoute("/_unauthenticated/signup")({
  component: RouteComponent,
})

function RouteComponent() {
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await register({ data })

      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (response.error) {
        throw new Error(response.error.message || "Sign Up failed")
      }

      return response
    },
    onSuccess: (response) => {
      if (response.data.url) {
        window.location.href = response.data.url
        return
      }

      throw redirect({ to: "/" })
    },
  })

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const email = formData.get("email")!.toString()
      const password = formData.get("password")!.toString()

      mutation.mutate({ email, password })
    },
    []
  )

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-[60ch] flex-col gap-6">
        <h1 className="text-2xl">Create an Account</h1>
        <form
          className="flex h-full flex-col items-center justify-center gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col gap-4">
            <Field>
              <FieldGroup className="flex flex-col gap-1">
                <FieldLabel>Email</FieldLabel>
                <Input name="email" type="email" required />
              </FieldGroup>
            </Field>
            <Field>
              <FieldGroup className="flex flex-col gap-1">
                <FieldLabel>Password</FieldLabel>
                <Input name="password" type="password" required />
              </FieldGroup>
            </Field>
            {mutation.isError && (
              <FieldError>{mutation.error.message}</FieldError>
            )}
          </div>
          <Button
            type="submit"
            variant="default"
            className="flex w-full"
            disabled={mutation.isPending}
          >
            Sign Up
          </Button>
        </form>
        <div className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          Already have an account?
          <a
            href="/login"
            className={cn(
              buttonVariants({ variant: "link", size: "sm" }),
              "p-0"
            )}
          >
            Log in
          </a>
        </div>
      </div>
    </main>
  )
}
