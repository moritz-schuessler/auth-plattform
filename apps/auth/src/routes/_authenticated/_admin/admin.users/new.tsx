import { Link, createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@auth-plattform/ui/components/button"
import CreateUserForm from "./-components/create-user-form"
import useCreateUser from "./-hooks/use-create-user"

export const Route = createFileRoute("/_authenticated/_admin/admin/users/new")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const mutation = useCreateUser()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <div className="flex flex-col gap-1">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          className="self-start text-muted-foreground"
          render={<Link to="/admin/users">← Users</Link>}
        />
        <h1 className="text-2xl">Create user</h1>
      </div>
      <CreateUserForm
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: ({ user }) =>
              navigate({
                to: "/admin/users/$userId",
                params: { userId: user.id },
              }),
          })
        }
        isPending={mutation.isPending || mutation.isSuccess}
        error={
          mutation.isError
            ? `The user could not be created: ${mutation.error.message}`
            : null
        }
      />
    </main>
  )
}
