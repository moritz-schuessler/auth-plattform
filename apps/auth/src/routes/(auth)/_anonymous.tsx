import { Outlet, createFileRoute } from "@tanstack/react-router"

import { requireAnonymous } from "@/lib/auth/server/guards"
import AuthNavigation from "@/components/navigation/auth-navigation"

export const Route = createFileRoute("/(auth)/_anonymous")({
  beforeLoad: async () => {
    await requireAnonymous()
  },
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <div className="flex h-full">
      <div className="flex size-full flex-col">
        <AuthNavigation />
        <Outlet />
      </div>
      <div className="w-full bg-sidebar" />
    </div>
  )
}
