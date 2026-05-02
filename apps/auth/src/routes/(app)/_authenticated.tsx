import { Outlet, createFileRoute } from "@tanstack/react-router"
import { requireSession } from "@/lib/auth/server/guards"
import AppNavigation from "@/components/navigation/app-navigation"

export const Route = createFileRoute("/(app)/_authenticated")({
  beforeLoad: async () => requireSession(),
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <AppNavigation>
      <Outlet />
    </AppNavigation>
  )
}
