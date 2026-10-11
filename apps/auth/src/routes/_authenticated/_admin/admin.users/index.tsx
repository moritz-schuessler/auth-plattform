import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { asc, inArray } from "drizzle-orm"
import UserTable from "./-components/user-table"
import { auth } from "@/lib/auth/server/auth"
import db from "@/data/db"
import { oauthClient } from "@/data/schema"

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()

  const { users, total } = await auth.api.listUsers({
    headers,
    query: {},
  })

  const oauthClients =
    users.length > 0
      ? await db
          .select({
            clientId: oauthClient.clientId,
            name: oauthClient.name,
            userId: oauthClient.userId,
          })
          .from(oauthClient)
          .where(
            inArray(
              oauthClient.userId,
              users.map((user) => user.id)
            )
          )
          .orderBy(asc(oauthClient.name))
      : []

  return {
    users: users.map((user) => ({
      ...user,
      oauthClients: oauthClients
        .filter((client) => client.userId === user.id)
        .map(({ clientId, name }) => ({ clientId, name })),
    })),
    total,
  }
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
