import { Outlet, createFileRoute } from "@tanstack/react-router"

import { getSession } from "@/lib/auth/server/session"
import PublicNavigation from "@/components/navigation/public-navigation"

export const Route = createFileRoute("/(public)")({
  beforeLoad: async () => {
    const session = await getSession()
    return {
      user: session?.user ?? null,
    }
  },
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <PublicNavigation user={user} />
      <Outlet />
    </>
  )
}
