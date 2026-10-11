import { Link, createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { and, asc, eq, inArray } from "drizzle-orm"
import { Plus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@auth-plattform/ui/components/button"
import UserTable from "./-components/user-table"
import { auth } from "@/lib/auth/server/auth"
import db from "@/data/db"
import { account, oauthClient } from "@/data/schema"

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()

  const { users, total } = await auth.api.listUsers({
    headers,
    query: {},
  })

  const userIds = users.map((user) => user.id)

  const credentialAccounts =
    users.length > 0
      ? await db
          .select({ userId: account.userId })
          .from(account)
          .where(
            and(
              eq(account.providerId, "credential"),
              inArray(account.userId, userIds)
            )
          )
      : []

  const registeredUserIds = new Set(
    credentialAccounts.map(({ userId }) => userId)
  )

  const oauthClients =
    users.length > 0
      ? await db
          .select({
            clientId: oauthClient.clientId,
            name: oauthClient.name,
            userId: oauthClient.userId,
          })
          .from(oauthClient)
          .where(inArray(oauthClient.userId, userIds))
          .orderBy(asc(oauthClient.name))
      : []

  return {
    users: users.map((user) => ({
      ...user,
      invited: !registeredUserIds.has(user.id),
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
      <div className="flex justify-between">
        <h1 className="text-2xl">Users</h1>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link to="/admin/users/new">
              <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
              Create user
            </Link>
          }
        />
      </div>
      <UserTable users={users} currentUserId={currentUser.id} />
      {total > users.length && (
        <p className="text-sm text-muted-foreground">
          Showing {users.length} of {total} users.
        </p>
      )}
    </main>
  )
}
