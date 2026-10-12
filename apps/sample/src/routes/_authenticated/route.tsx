import { Outlet, createFileRoute } from "@tanstack/react-router"
import { requireSession } from "@/lib/auth/server/guards"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    return await requireSession()
  },
  component: Outlet,
})
