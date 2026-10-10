import { Button } from "@auth-plattform/ui/components/button"
import CredentialField from "./credential-field"
import type { CreatedClient } from "../-hooks/use-created-client"

interface CreatedClientCardProps {
  client: CreatedClient
  onDismiss: () => void
}

const CreatedClientCard = ({ client, onDismiss }: CreatedClientCardProps) => {
  return (
    <section className="flex animate-in flex-col gap-4 border border-primary/40 bg-primary/5 p-4 duration-200 ease-out fade-in slide-in-from-top-1 motion-reduce:animate-none">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg">{client.client_name} was registered</h2>
          <p className="text-sm text-muted-foreground">
            Copy the client secret now. It is stored hashed and can't be shown
            again.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
      <CredentialField label="Client ID" value={client.client_id} />
      {client.client_secret && (
        <CredentialField label="Client secret" value={client.client_secret} />
      )}
    </section>
  )
}

export default CreatedClientCard
