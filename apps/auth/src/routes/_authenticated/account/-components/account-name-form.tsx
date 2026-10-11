import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useUpdateName from "../-hooks/use-update-name"

interface AccountNameFormProps {
  user: { name: string }
}

const AccountNameForm = ({ user }: AccountNameFormProps) => {
  const [name, setName] = useState(user.name)
  const mutation = useUpdateName()

  const trimmedName = name.trim()
  const isUnchanged = trimmedName === user.name

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate({ name: trimmedName })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <div className="flex gap-2">
          <Input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Button
            type="submit"
            className="w-20"
            disabled={isUnchanged || mutation.isPending}
          >
            Save
          </Button>
        </div>
        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
      </Field>
    </form>
  )
}

export default AccountNameForm
