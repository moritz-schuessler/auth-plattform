import { useEffect, useRef } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import CredentialField from "./credential-field"
import type { ClientSecret } from "../-hooks/use-client-secret"

interface ClientSecretCardProps {
  clientSecret: ClientSecret
  onDismiss: () => void
}

const descriptions = {
  created:
    "Copy the client secret now. It is stored hashed and can't be shown again.",
  rotated:
    "Copy it now: the previous secret no longer works, and this one can't be shown again.",
}

const ClientSecretCard = ({
  clientSecret,
  onDismiss,
}: ClientSecretCardProps) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest" })
  }, [clientSecret.client_secret])

  return (
    <section
      ref={ref}
      className="flex animate-in flex-col gap-4 border border-primary/40 bg-primary/5 p-4 duration-200 ease-out fade-in slide-in-from-top-1 motion-reduce:animate-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg">
            {clientSecret.reason === "created"
              ? `${clientSecret.client_name} was registered`
              : `New secret for ${clientSecret.client_name}`}
          </h2>
          <p className="text-sm text-muted-foreground">
            {descriptions[clientSecret.reason]}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
      {clientSecret.reason === "created" && (
        <CredentialField label="Client ID" value={clientSecret.client_id} />
      )}
      <CredentialField
        label="Client secret"
        value={clientSecret.client_secret}
      />
    </section>
  )
}

export default ClientSecretCard
