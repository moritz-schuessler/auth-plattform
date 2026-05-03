import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth/server/auth"

const listUsers = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()

  return await auth.api.listUsers({
    headers,
    query: {},
  })
})

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  loader: async () => {
    return await listUsers()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { users } = Route.useLoaderData()

  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Admin</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </main>
  )
}
