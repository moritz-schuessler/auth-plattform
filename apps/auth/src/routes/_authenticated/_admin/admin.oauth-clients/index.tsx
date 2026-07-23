import { Link, createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { Plus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@auth-plattform/ui/components/button"
import type { OAuthClient as BetterAuthOAuthClient } from "@better-auth/oauth-provider"
import { auth } from "@/lib/auth/server/auth"

// better-auth's OAuthClient has a `[key: string]: unknown` index signature
// that TanStack Start cannot prove is serializable; drop it while keeping
// every named field.
type OAuthClient = {
  [K in keyof BetterAuthOAuthClient as string extends K
    ? never
    : K]: BetterAuthOAuthClient[K]
}

const listOAuthClients = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ oAuthClients: Array<OAuthClient> }> => {
    const headers = getRequestHeaders()

    const oAuthClients = await auth.api.getOAuthClients({
      headers,
      query: {},
    })

    return {
      oAuthClients: oAuthClients ?? [],
    }
  }
)

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients/"
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
      <div className="flex justify-between">
        <h1 className="text-2xl">OAuth Clients</h1>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link
              to="/admin/oauth-clients/new"
              activeProps={{
                className: "text-primary",
              }}
            >
              <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
              Register new OAuth client
            </Link>
          }
        />
      </div>
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
