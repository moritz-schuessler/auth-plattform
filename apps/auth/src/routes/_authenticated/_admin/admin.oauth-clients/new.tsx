import { createFileRoute } from "@tanstack/react-router"
import CreateClientForm from "./-components/create-client-form"
import useCreateClient from "./-hooks/use-create-client"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients/new"
)({
  component: RouteComponent,
})

function RouteComponent() {
  const mutation = useCreateClient()

  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Register OAuth‑Application</h1>
      <CreateClientForm
        onSubmit={mutation.mutate}
        error={
          mutation.isError
            ? `The client could not be created: ${mutation.error.message}`
            : null
        }
      />
    </main>
  )
}
