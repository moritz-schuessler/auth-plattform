import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { getSession } from "@/lib/auth/server/session"

export const Route = createFileRoute("/(app)/_authenticated")({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: "/login" })
    }
  },
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return <Outlet />
}
