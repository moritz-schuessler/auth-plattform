import { Outlet, createFileRoute } from "@tanstack/react-router"
import { requireAdmin } from "@/lib/auth/server/guards"

export const Route = createFileRoute("/_authenticated/_admin")({
  beforeLoad: async () => requireAdmin(),
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return <Outlet />
}
