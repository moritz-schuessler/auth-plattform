import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients/new"
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Register OAuth client</h1>
    </main>
  )
}
