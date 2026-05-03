import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/_admin/admin")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex w-full flex-col p-4">
      <h1 className="text-2xl">Admin</h1>
      <p className="mt-2">You are admin</p>
    </main>
  )
}
