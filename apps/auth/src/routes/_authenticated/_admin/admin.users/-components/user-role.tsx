import { Button } from "@auth-plattform/ui/components/button"
import useSetRole from "../-hooks/use-set-role"

interface UserRoleProps {
  user: { id: string; role: string | null }
  isCurrentUser: boolean
}

const UserRole = ({ user, isCurrentUser }: UserRoleProps) => {
  const mutation = useSetRole()
  const isAdmin = user.role?.split(",").includes("admin") ?? false

  if (isCurrentUser) {
    return (
      <p className="text-sm text-muted-foreground">
        You can't change your own role.
      </p>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex flex-col gap-1 text-muted-foreground">
        <span>
          {isAdmin
            ? "This user is an admin and can manage users and OAuth clients."
            : "Admins can manage users and OAuth clients."}
        </span>
        {mutation.isError && (
          <span className="text-destructive">{mutation.error.message}</span>
        )}
      </div>
      <Button
        variant="outline"
        disabled={mutation.isPending}
        onClick={() =>
          mutation.mutate({ userId: user.id, role: isAdmin ? "user" : "admin" })
        }
      >
        {isAdmin ? "Remove admin rights" : "Make admin"}
      </Button>
    </div>
  )
}

export default UserRole
