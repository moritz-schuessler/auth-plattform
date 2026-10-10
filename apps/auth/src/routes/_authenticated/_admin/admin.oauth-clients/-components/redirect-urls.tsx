import { useState } from "react"
import { Plus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@auth-plattform/ui/components/button"
import { FieldError } from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useUpdateClient from "../-hooks/use-update-client"
import CopyButton from "./copy-button"

interface RedirectUrlsProps {
  client: { client_id: string; redirect_uris: Array<string> }
}

const RedirectUrls = ({ client }: RedirectUrlsProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [url, setUrl] = useState("")
  const mutation = useUpdateClient()

  const trimmedUrl = url.trim()
  const isDuplicate = client.redirect_uris.includes(trimmedUrl)

  const updateUrls = (redirect_uris: Array<string>, onSuccess?: () => void) => {
    mutation.mutate(
      { client_id: client.client_id, update: { redirect_uris } },
      { onSuccess }
    )
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    updateUrls([...client.redirect_uris, trimmedUrl], () => setIsAdding(false))
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Redirect URLs</h2>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Add redirect URL"
          disabled={isAdding}
          onClick={() => {
            mutation.reset()
            setUrl("")
            setIsAdding(true)
          }}
        >
          <HugeiconsIcon icon={Plus} />
        </Button>
      </div>
      <ul className="flex flex-col divide-y divide-border border border-border">
        {client.redirect_uris.map((uri) => (
          <li
            key={uri}
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
          >
            <span className="break-all">{uri}</span>
            <div className="flex items-center gap-1">
              <CopyButton value={uri} label={`Copy redirect URL ${uri}`} />
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground"
                aria-label={`Remove redirect URL ${uri}`}
                disabled={
                  client.redirect_uris.length === 1 || mutation.isPending
                }
                onClick={() =>
                  updateUrls(
                    client.redirect_uris.filter((current) => current !== uri)
                  )
                }
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
        {isAdding && (
          <li className="px-3 py-2">
            <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  name="redirect_uri"
                  aria-label="New redirect URL"
                  placeholder="https://app.example.com/auth/callback"
                  autoFocus
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
                <Button
                  type="submit"
                  disabled={!trimmedUrl || isDuplicate || mutation.isPending}
                >
                  Add
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={mutation.isPending}
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
              {isDuplicate && (
                <FieldError>
                  This redirect URL is already registered.
                </FieldError>
              )}
              {mutation.isError && (
                <FieldError>{mutation.error.message}</FieldError>
              )}
            </form>
          </li>
        )}
      </ul>
      {!isAdding && mutation.isError && (
        <FieldError>{mutation.error.message}</FieldError>
      )}
    </section>
  )
}

export default RedirectUrls
