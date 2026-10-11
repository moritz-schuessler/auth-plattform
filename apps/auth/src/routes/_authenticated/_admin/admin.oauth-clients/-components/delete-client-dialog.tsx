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
import useDeleteClient from "../-hooks/use-delete-client"

interface DeleteClientDialogProps {
  client: { client_id: string; client_name?: string | null }
  trigger: React.ReactElement
  onDeleted: () => void | Promise<void>
}

const DeleteClientDialog = ({
  client,
  trigger,
  onDeleted,
}: DeleteClientDialogProps) => {
  const [open, setOpen] = useState(false)
  const mutation = useDeleteClient()

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) {
      return
    }

    mutation.reset()
    setOpen(nextOpen)
  }

  const handleDelete = () => {
    mutation.mutate(client.client_id, {
      onSuccess: async () => {
        await onDeleted()
        setOpen(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {client.client_name ?? client.client_id}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This can't be undone. Every application using this client stops
            working immediately.
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

export default DeleteClientDialog
