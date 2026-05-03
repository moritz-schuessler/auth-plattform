import { createFileRoute } from "@tanstack/react-router"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { authClient } from "@/lib/auth/client/auth-client"

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  loader: async () => {
    const headers = getRequestHeaders()

    return await authClient.admin.listUsers({
      query: {},
      fetchOptions: { headers },
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = Route.useLoaderData()

  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Admin</h1>
      <ul>
        {data?.users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </main>
  )
}
