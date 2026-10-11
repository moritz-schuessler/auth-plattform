import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@auth-plattform/ui/components/alert-dialog"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useDeleteAccount from "../-hooks/use-delete-account"

interface DeleteAccountDialogProps {
  oauthClients: Array<{ clientId: string; name: string | null }>
  trigger: React.ReactElement
  onDeleted: () => void | Promise<void>
}

const DeleteAccountDialog = ({
  oauthClients,
  trigger,
  onDeleted,
}: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const mutation = useDeleteAccount()

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) {
      return
    }

    mutation.reset()
    setPassword("")
    setOpen(nextOpen)
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    mutation.mutate(
      { password },
      {
        onSuccess: async () => {
          await onDeleted()
        },
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. Your account, your sessions and your access
              to every connected application are removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {oauthClients.length > 0 && (
            <div className="flex flex-col gap-2 text-sm">
              <p>
                This also deletes the OAuth{" "}
                {oauthClients.length === 1 ? "client" : "clients"} you own.
                Every application using{" "}
                {oauthClients.length === 1 ? "it" : "them"} stops working
                immediately:
              </p>
              <ul className="list-inside list-disc font-medium">
                {oauthClients.map((client) => (
                  <li key={client.clientId}>
                    {client.name ?? client.clientId}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Field>
            <FieldLabel htmlFor="delete-account-password">
              Confirm with your password
            </FieldLabel>
            <Input
              type="password"
              id="delete-account-password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {mutation.isError && (
              <FieldError>{mutation.error.message}</FieldError>
            )}
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              variant="destructive"
              disabled={!password || mutation.isPending || mutation.isSuccess}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAccountDialog
