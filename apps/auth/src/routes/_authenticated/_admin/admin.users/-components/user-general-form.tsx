import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useUpdateUser from "../-hooks/use-update-user"

interface UserGeneralFormProps {
  user: { id: string; name: string; email: string }
}

const UserGeneralForm = ({ user }: UserGeneralFormProps) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const mutation = useUpdateUser()

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()
  const isUnchanged = trimmedName === user.name && trimmedEmail === user.email

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate({
      userId: user.id,
      data: { name: trimmedName, email: trimmedEmail },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
      </Field>
      <Button
        type="submit"
        className="w-20 self-start"
        disabled={!trimmedEmail || isUnchanged || mutation.isPending}
      >
        Save
      </Button>
    </form>
  )
}

export default UserGeneralForm
