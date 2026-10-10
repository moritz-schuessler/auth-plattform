import { Outlet, createFileRoute } from "@tanstack/react-router"
import { CreatedClientProvider } from "./-hooks/use-created-client"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients"
)({
  component: LayoutComponent,
})

function LayoutComponent() {
  return (
    <CreatedClientProvider>
      <Outlet />
    </CreatedClientProvider>
  )
}
