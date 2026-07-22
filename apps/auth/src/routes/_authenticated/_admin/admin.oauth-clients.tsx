import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { auth } from "@/lib/auth/server/auth"

const listOAuthClients = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders()

  const oAuthClients = await auth.api.getOAuthClients({
    headers,
    query: {},
  })

  return {
    oAuthClients: oAuthClients ?? [],
  }
})

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients"
)({
  loader: async () => {
    return await listOAuthClients()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { oAuthClients } = Route.useLoaderData()

  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">OAuth Clients</h1>
      <ul>
        {oAuthClients.map((client) => (
          <li key={client.client_id}>
            {client.client_name ?? client.client_id}
          </li>
        ))}
        {oAuthClients.length === 0 && <li>No OAuth clients found.</li>}
      </ul>
    </main>
  )
}
