import { Outlet, createFileRoute } from "@tanstack/react-router"
import { ClientSecretProvider } from "./-hooks/use-client-secret"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients"
)({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <ClientSecretProvider>
      <Outlet />
    </ClientSecretProvider>
  )
}
