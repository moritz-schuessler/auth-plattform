import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useChangePassword from "../-hooks/use-change-password"

const MIN_PASSWORD_LENGTH = 8

const AccountPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const mutation = useChangePassword()

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="current-password">Current password</FieldLabel>
        <Input
          type="password"
          id="current-password"
          name="current-password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="new-password">New password</FieldLabel>
        <Input
          type="password"
          id="new-password"
          name="new-password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <FieldDescription>
          At least {MIN_PASSWORD_LENGTH} characters. Changing your password
          signs you out on all other devices.
        </FieldDescription>
        {mutation.isError && <FieldError>{mutation.error.message}</FieldError>}
      </Field>
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          className="self-start"
          disabled={!currentPassword || !newPassword || mutation.isPending}
        >
          Change password
        </Button>
        {mutation.isSuccess && (
          <p className="text-sm text-muted-foreground">Password changed.</p>
        )}
      </div>
    </form>
  )
}

export default AccountPasswordForm
