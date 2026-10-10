import { useState } from "react"
import { Plus } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@auth-plattform/ui/components/button"
import { FieldError } from "@auth-plattform/ui/components/field"
import { Input } from "@auth-plattform/ui/components/input"
import useUpdateClient from "../-hooks/use-update-client"
import CopyButton from "./copy-button"

interface ClientUrlsProps {
  clientId: string
  field: "redirect_uris" | "post_logout_redirect_uris"
  urls: Array<string>
  title: string
  label: string
  placeholder: string
}

const ClientUrls = ({
  clientId,
  field,
  urls,
  title,
  label,
  placeholder,
}: ClientUrlsProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [url, setUrl] = useState("")
  const mutation = useUpdateClient()

  const trimmedUrl = url.trim()
  const isDuplicate = urls.includes(trimmedUrl)

  const updateUrls = (nextUrls: Array<string>, onSuccess?: () => void) => {
    mutation.mutate(
      { client_id: clientId, update: { [field]: nextUrls } },
      { onSuccess }
    )
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    updateUrls([...urls, trimmedUrl], () => setIsAdding(false))
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">{title}</h2>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Add ${label}`}
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
        {urls.map((uri) => (
          <li
            key={uri}
            className="flex items-center justify-between gap-4 px-3 py-2 text-sm"
          >
            <span className="break-all">{uri}</span>
            <div className="flex items-center gap-1">
              <CopyButton value={uri} label={`Copy ${label} ${uri}`} />
              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground"
                aria-label={`Remove ${label} ${uri}`}
                disabled={urls.length === 1 || mutation.isPending}
                onClick={() =>
                  updateUrls(urls.filter((current) => current !== uri))
                }
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
        {urls.length === 0 && !isAdding && (
          <li className="px-3 py-2 text-sm text-muted-foreground">
            No URLs registered.
          </li>
        )}
        {isAdding && (
          <li className="px-3 py-2">
            <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  name={field}
                  aria-label={`New ${label}`}
                  placeholder={placeholder}
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
                <FieldError>This URL is already registered.</FieldError>
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

export default ClientUrls
