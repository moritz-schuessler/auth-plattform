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
import { Field, FieldLabel } from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@auth-plattform/ui/components/select"
import useBanUser from "../-hooks/use-ban-user"

interface BanUserDialogProps {
  user: { id: string; name: string; email: string }
  trigger: React.ReactElement
  onBanned: () => void | Promise<void>
}

const day = 60 * 60 * 24

const durations = {
  never: "Until unbanned",
  [day]: "1 day",
  [day * 7]: "7 days",
  [day * 30]: "30 days",
}

const BanUserDialog = ({ user, trigger, onBanned }: BanUserDialogProps) => {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("never")
  const mutation = useBanUser()

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) {
      return
    }

    mutation.reset()
    setOpen(nextOpen)
  }

  const handleBan = () => {
    mutation.mutate(
      {
        userId: user.id,
        banReason: reason.trim() || undefined,
        banExpiresIn: duration === "never" ? undefined : Number(duration),
      },
      {
        onSuccess: async () => {
          await onBanned()
          setOpen(false)
          setReason("")
          setDuration("never")
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
            Ban {user.name.trim() || user.email}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The user is signed out everywhere and can't sign in again until the
            ban ends.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Field>
          <FieldLabel htmlFor="ban_reason">Reason (optional)</FieldLabel>
          <Input
            type="text"
            id="ban_reason"
            name="ban_reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel id="ban_duration_label">Duration</FieldLabel>
          <Select
            items={durations}
            value={duration}
            onValueChange={(value) => {
              if (value) {
                setDuration(value)
              }
            }}
          >
            <SelectTrigger aria-labelledby="ban_duration_label">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(durations).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
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
            onClick={handleBan}
          >
            Ban
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BanUserDialog
