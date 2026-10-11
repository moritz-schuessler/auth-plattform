import { useState } from "react"
import { z } from "zod"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import { createUserSchema } from "../-schemas/create-user"
import type { CreateUserInput } from "../-schemas/create-user"

interface CreateUserFormProps {
  onSubmit: (data: CreateUserInput) => void
  isPending: boolean
  error?: string | null
}

type FieldErrors = Partial<Record<keyof CreateUserInput, string>>

const CreateUserForm = ({
  onSubmit,
  isPending,
  error,
}: CreateUserFormProps) => {
  const [errors, setErrors] = useState<FieldErrors>({})
  const hasFieldErrors = Object.values(errors).some(Boolean)

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = createUserSchema.safeParse({
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
    })

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error)

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      })
      return
    }

    setErrors({})
    onSubmit(result.data)
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          type="text"
          id="name"
          name="name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <FieldError id="name-error">{errors.name}</FieldError>}
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          type="email"
          id="email"
          name="email"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <FieldError id="email-error">{errors.email}</FieldError>
        )}
      </Field>
      {error && !hasFieldErrors && <FieldError>{error}</FieldError>}
      <Button type="submit" className="self-start" disabled={isPending}>
        Create user
      </Button>
    </form>
  )
}

export default CreateUserForm
