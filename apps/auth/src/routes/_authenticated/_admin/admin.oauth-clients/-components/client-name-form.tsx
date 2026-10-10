import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useUpdateClient from "../-hooks/use-update-client"

interface ClientNameFormProps {
  client: { client_id: string; client_name: string | null }
}

const ClientNameForm = ({ client }: ClientNameFormProps) => {
  const [name, setName] = useState(client.client_name ?? "")
  const mutation = useUpdateClient()

  const trimmedName = name.trim()
  const isUnchanged = trimmedName === (client.client_name ?? "")

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate({
      client_id: client.client_id,
      update: { client_name: trimmedName },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="client_name">Name</FieldLabel>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            id="client_name"
            name="client_name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            type="submit"
            className="w-20"
            disabled={!trimmedName || isUnchanged || mutation.isPending}
          >
            Save
          </Button>
        </div>
        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
      </Field>
    </form>
  )
}

export default ClientNameForm
