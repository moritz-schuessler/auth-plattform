import {
  Link,
  createFileRoute,
  notFound,
  useNavigate,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { Button } from "@auth-plattform/ui/components/button"
import { Separator } from "@auth-plattform/ui/components/separator"
import ClientCredentials from "./-components/client-credentials"
import ClientNameForm from "./-components/client-name-form"
import ClientSecretCard from "./-components/client-secret-card"
import DeleteClientDialog from "./-components/delete-client-dialog"
import RedirectUrls from "./-components/redirect-urls"
import useClientSecret from "./-hooks/use-client-secret"
import { auth } from "@/lib/auth/server/auth"

const getOAuthClient = createServerFn({ method: "GET" })
  .inputValidator((clientId: string) => clientId)
  .handler(async ({ data: clientId }) => {
    const headers = getRequestHeaders()

    try {
      const client = await auth.api.getOAuthClient({
        headers,
        query: { client_id: clientId },
      })

      return {
        client_id: client.client_id,
        client_name: client.client_name ?? null,
        redirect_uris: client.redirect_uris,
        public: client.public ?? false,
      }
    } catch {
      return null
    }
  })

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients/$clientId"
)({
  loader: async ({ params }) => {
    const client = await getOAuthClient({ data: params.clientId })

    if (!client) {
      throw notFound()
    }

    return { client }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { client } = Route.useLoaderData()
  const { clientSecret, setClientSecret } = useClientSecret()
  const navigate = useNavigate()

  return (
    <main className="flex w-full flex-col gap-6 overflow-y-auto p-4">
      <div className="flex flex-col gap-1">
        <Button
          variant="link"
          size="sm"
          nativeButton={false}
          className="self-start text-muted-foreground"
          render={<Link to="/admin/oauth-clients">← OAuth Clients</Link>}
        />
        <h1 className="text-2xl">{client.client_name ?? client.client_id}</h1>
      </div>
      {clientSecret?.client_id === client.client_id && (
        <ClientSecretCard
          clientSecret={clientSecret}
          onDismiss={() => setClientSecret(null)}
        />
      )}
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">General</h2>
        <ClientNameForm client={client} />
      </section>
      <Separator />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">Credentials</h2>
        <ClientCredentials client={client} />
      </section>
      <Separator />
      <RedirectUrls client={client} />
      <Separator />
      <section className="flex flex-col gap-3">
        <h2 className="text-lg">Danger zone</h2>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">
            Deleting a client can't be undone. Every application using it stops
            working immediately.
          </span>
          <DeleteClientDialog
            client={client}
            onDeleted={() => navigate({ to: "/admin/oauth-clients" })}
            trigger={<Button variant="destructive">Delete client</Button>}
          />
        </div>
      </section>
    </main>
  )
}
