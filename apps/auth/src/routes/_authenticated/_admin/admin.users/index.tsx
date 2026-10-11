import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import UserTable from "./-components/user-table"
import { auth } from "@/lib/auth/server/auth"

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()

  return await auth.api.listUsers({
    headers,
    query: {},
  })
})

export const Route = createFileRoute("/_authenticated/_admin/admin/users/")({
  loader: async () => {
    return await listUsers()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { users, total } = Route.useLoaderData()
  const { user: currentUser } = Route.useRouteContext()

  return (
    <main className="flex w-full flex-col gap-4 overflow-y-auto p-4">
      <h1 className="text-2xl">Users</h1>
      <UserTable users={users} currentUserId={currentUser.id} />
      {total > users.length && (
        <p className="text-sm text-muted-foreground">
          Showing {users.length} of {total} users.
        </p>
      )}
    </main>
  )
}
