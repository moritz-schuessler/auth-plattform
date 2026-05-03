import { createFileRoute } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = authClient.useSession()

  return (
    <main className="flex w-full flex-col p-4">
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-2">Welcome, {data?.user.email}!</p>
    </main>
  )
}
