import { Input } from "@auth-plattform/ui/components/input"
import { FieldError } from "@auth-plattform/ui/components/field"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import { createClientSchema } from "../-schemas/create-client"
import type { CreateClientInput } from "../-schemas/create-client"

interface CreateClientFormProps {
  onSubmit: (
    data: CreateClientInput,
    options: { onSuccess: () => void }
  ) => void
  error?: string | null
}

type FieldErrors = Partial<Record<keyof CreateClientInput, string>>

const CreateClientForm = ({ onSubmit, error }: CreateClientFormProps) => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FieldErrors>({})
  const hasFieldErrors = Boolean(errors.client_name || errors.redirect_uri)

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = createClientSchema.safeParse({
      client_name: formData.get("client_name")?.toString() ?? "",
      redirect_uri: formData.get("redirect_uri")?.toString() ?? "",
    })

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error)

      setErrors({
        client_name: fieldErrors.client_name?.[0],
        redirect_uri: fieldErrors.redirect_uri?.[0],
      })
      return
    }

    setErrors({})
    onSubmit(result.data, {
      onSuccess: () => {
        navigate({ to: ".." })
      },
    })
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="client_name">Application Name</label>
        <Input
          type="text"
          id="client_name"
          name="client_name"
          placeholder="Enter client name"
          className="rounded border p-2"
          aria-invalid={errors.client_name ? true : undefined}
          aria-describedby={
            errors.client_name ? "client_name-error" : undefined
          }
        />
        {errors.client_name && (
          <FieldError id="client_name-error">{errors.client_name}</FieldError>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="redirect_uri">Redirect URL</label>
        <Input
          type="text"
          id="redirect_uri"
          name="redirect_uri"
          placeholder="Enter redirect URL"
          className="rounded border p-2"
          aria-invalid={errors.redirect_uri ? true : undefined}
          aria-describedby={
            errors.redirect_uri ? "redirect_uri-error" : undefined
          }
        />
        {errors.redirect_uri && (
          <FieldError id="redirect_uri-error">{errors.redirect_uri}</FieldError>
        )}
      </div>
      {error && !hasFieldErrors && <FieldError>{error}</FieldError>}
      <button
        type="submit"
        className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
      >
        Create OAuth‑Application
      </button>
    </form>
  )
}

export default CreateClientForm
