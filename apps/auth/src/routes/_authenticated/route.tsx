import { Outlet, createFileRoute } from "@tanstack/react-router"
import { requireSession } from "@/lib/auth/server/guards"
import AppNavigation from "@/components/navigation/app-navigation"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    return await requireSession()
  },
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  const { user } = Route.useRouteContext()

  const isAdmin = user.role?.includes("admin") ?? false

  return (
    <AppNavigation isAdmin={isAdmin}>
      <Outlet />
    </AppNavigation>
  )
}
