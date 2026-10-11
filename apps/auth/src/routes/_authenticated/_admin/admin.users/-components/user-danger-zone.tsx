import { useNavigate, useRouter } from "@tanstack/react-router"
import { Button } from "@auth-plattform/ui/components/button"
import useUnbanUser from "../-hooks/use-unban-user"
import BanUserDialog from "./ban-user-dialog"
import DeleteUserDialog from "./delete-user-dialog"

interface UserDangerZoneProps {
  user: {
    id: string
    name: string
    email: string
    banned: boolean
    banReason: string | null
    banExpires: Date | null
    oauthClients: Array<{ clientId: string; name: string | null }>
  }
  isCurrentUser: boolean
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
})

const UserDangerZone = ({ user, isCurrentUser }: UserDangerZoneProps) => {
  const router = useRouter()
  const navigate = useNavigate()
  const unban = useUnbanUser()

  if (isCurrentUser) {
    return (
      <p className="text-sm text-muted-foreground">
        You can't ban or delete your own account.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center justify-between gap-4">
        {user.banned ? (
          <div className="flex flex-col gap-1 text-muted-foreground">
            <span>
              This user is banned
              {user.banExpires
                ? ` until ${dateFormatter.format(user.banExpires)}`
                : ""}
              {user.banReason ? `: ${user.banReason}` : "."}
            </span>
            {unban.isError && (
              <span className="text-destructive">{unban.error.message}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">
            Banning signs the user out everywhere and blocks new sign-ins.
          </span>
        )}
        {user.banned ? (
          <Button
            variant="outline"
            disabled={unban.isPending}
            onClick={() =>
              unban.mutate(
                { userId: user.id },
                { onSuccess: () => router.invalidate() }
              )
            }
          >
            Unban user
          </Button>
        ) : (
          <BanUserDialog
            user={user}
            onBanned={() => router.invalidate()}
            trigger={<Button variant="destructive">Ban user</Button>}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">
          Deleting a user can't be undone.
          {user.oauthClients.length > 0 &&
            ` It also deletes the ${user.oauthClients.length} OAuth ${
              user.oauthClients.length === 1 ? "client" : "clients"
            } owned by this user.`}
        </span>
        <DeleteUserDialog
          user={user}
          onDeleted={() => navigate({ to: "/admin/users" })}
          trigger={<Button variant="destructive">Delete user</Button>}
        />
      </div>
    </div>
  )
}

export default UserDangerZone
