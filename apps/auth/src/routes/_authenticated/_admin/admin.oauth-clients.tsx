import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients"
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">OAuth Clients</h1>
    </main>
  )
}
