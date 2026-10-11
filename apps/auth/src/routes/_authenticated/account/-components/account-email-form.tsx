import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useChangeEmail from "../-hooks/use-change-email"

interface AccountEmailFormProps {
  user: { email: string }
}

const AccountEmailForm = ({ user }: AccountEmailFormProps) => {
  const [email, setEmail] = useState(user.email)
  const mutation = useChangeEmail()

  const trimmedEmail = email.trim()
  const isUnchanged = trimmedEmail.toLowerCase() === user.email

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate({ newEmail: trimmedEmail })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <div className="flex gap-2">
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            type="submit"
            className="w-20"
            disabled={!trimmedEmail || isUnchanged || mutation.isPending}
          >
            Save
          </Button>
        </div>
        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
      </Field>
    </form>
  )
}

export default AccountEmailForm
