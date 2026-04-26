import { Outlet, createFileRoute } from "@tanstack/react-router"

import { requireAnonymous } from "@/lib/auth/server/guards"

export const Route = createFileRoute("/(auth)/_anonymous")({
  beforeLoad: async () => {
    await requireAnonymous()
  },
  component: () => <Outlet />,
})
