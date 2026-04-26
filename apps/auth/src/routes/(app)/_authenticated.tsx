import { Outlet, createFileRoute } from "@tanstack/react-router"
import { requireSession } from "@/lib/auth/server/guards"

export const Route = createFileRoute("/(app)/_authenticated")({
  beforeLoad: async () => requireSession(),
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return <Outlet />
}
