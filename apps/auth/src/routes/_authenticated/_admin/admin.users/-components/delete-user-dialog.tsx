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
import useDeleteUser from "../-hooks/use-delete-user"

interface DeleteUserDialogProps {
  user: {
    id: string
    name: string
    email: string
    oauthClients: Array<{ clientId: string; name: string | null }>
  }
  trigger: React.ReactElement
  onDeleted: () => void | Promise<void>
}

const DeleteUserDialog = ({
  user,
  trigger,
  onDeleted,
}: DeleteUserDialogProps) => {
  const [open, setOpen] = useState(false)
  const mutation = useDeleteUser()

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) {
      return
    }

    mutation.reset()
    setOpen(nextOpen)
  }

  const handleDelete = () => {
    mutation.mutate(
      { userId: user.id },
      {
        onSuccess: async () => {
          await onDeleted()
          setOpen(false)
        },
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {user.name.trim() || user.email}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This can't be undone. The account, its sessions and its access to
            every connected application are removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {user.oauthClients.length > 0 && (
          <div className="flex flex-col gap-2 text-sm">
            <p>
              This also deletes the OAuth{" "}
              {user.oauthClients.length === 1 ? "client" : "clients"} owned by
              this user. Every application using{" "}
              {user.oauthClients.length === 1 ? "it" : "them"} stops working
              immediately:
            </p>
            <ul className="list-inside list-disc font-medium">
              {user.oauthClients.map((client) => (
                <li key={client.clientId}>{client.name ?? client.clientId}</li>
              ))}
            </ul>
          </div>
        )}
        {mutation.isError && (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUserDialog
