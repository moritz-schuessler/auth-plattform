import { useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Input } from "@auth-plattform/ui/components/input"

import { authClient } from "@/lib/auth/client/auth-client"

export const Route = createFileRoute(
  "/_authenticated/_admin/admin/oauth-clients/new"
)({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const mutation = useMutation({
    mutationFn: async (data: { client_name: string; redirect_uri: string }) => {
      const response = await authClient.oauth2.createClient({
        client_name: data.client_name,
        redirect_uris: [data.redirect_uri],
      })

      if (response.error) {
        throw new Error(response.error.message || "Create OAuth Client failed")
      }

      return response.data
    },
    onSuccess: (data) => {
      navigate({ to: ".." })
    },
  })

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const client_name = formData.get("client_name")!.toString()
      const redirect_uri = formData.get("redirect_uri")!.toString()

      mutation.mutate({ client_name, redirect_uri })
    },
    []
  )

  return (
    <main className="flex w-full flex-col gap-4 p-4">
      <h1 className="text-2xl">Register OAuth‑Application</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="client_name">Application Name</label>
          <Input
            type="text"
            id="client_name"
            name="client_name"
            placeholder="Enter client name"
            className="rounded border p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="redirect_uri">Redirect URL</label>
          <Input
            type="text"
            id="redirect_uri"
            name="redirect_uri"
            placeholder="Enter redirect URL"
            className="rounded border p-2"
          />
        </div>
        <button
          type="submit"
          className="hover:bg-primary-dark rounded bg-primary px-4 py-2 text-white"
        >
          Create OAuth‑Application
        </button>
      </form>
    </main>
  )
}
