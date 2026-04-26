import { useCallback } from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import { Button, buttonVariants } from "@auth-plattform/ui/components/button"
import { cn } from "@auth-plattform/ui/lib/utils"

import { authClient } from "@/lib/auth/client/auth-client"

export const Route = createFileRoute("/(auth)/_anonymous/signup")({
  component: RouteComponent,
})

function RouteComponent() {
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authClient.signUp.email({
        name: "",
        email: data.email,
        password: data.password,
      })

      if (response.error) {
        throw new Error(response.error.message || "Sign Up failed")
      }

      return response
    },
    onSuccess: () => {
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
    <div className="flex h-full">
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
            </div>
            <Button type="submit" variant="default" className="flex w-full">
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
      <div className="w-full bg-sidebar" />
    </div>
  )
}
