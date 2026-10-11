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
  user: { id: string; name: string; email: string; oauthClientCount: number }
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
            {user.oauthClientCount > 0 &&
              ` This also deletes ${user.oauthClientCount} OAuth ${
                user.oauthClientCount === 1 ? "client" : "clients"
              } owned by this user. Every application using ${
                user.oauthClientCount === 1 ? "it" : "them"
              } stops working immediately.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
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
