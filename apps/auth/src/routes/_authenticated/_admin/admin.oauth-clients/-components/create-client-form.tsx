import { Input } from "@auth-plattform/ui/components/input"
import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"

interface CreateClientFormProps {
  onSubmit: (
    data: { client_name: string; redirect_uri: string },
    options: { onSuccess: () => void }
  ) => void
}

const CreateClientForm = ({ onSubmit }: CreateClientFormProps) => {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const client_name = formData.get("client_name")!.toString()
      const redirect_uri = formData.get("redirect_uri")!.toString()

      onSubmit(
        { client_name, redirect_uri },
        {
          onSuccess: () => {
            navigate({ to: ".." })
          },
        }
      )
    },
    []
  )

  return (
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
  )
}

export default CreateClientForm
