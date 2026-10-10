import { useState } from "react"
import { Button } from "@auth-plattform/ui/components/button"
import useRotateSecret from "../-hooks/use-rotate-secret"
import CredentialField from "./credential-field"

interface ClientCredentialsProps {
  client: { client_id: string; client_name: string | null; public: boolean }
}

const ClientCredentials = ({ client }: ClientCredentialsProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const rotation = useRotateSecret()

  const handleRotate = () => {
    rotation.mutate(
      {
        client_id: client.client_id,
        client_name: client.client_name ?? client.client_id,
      },
      { onSuccess: () => setIsConfirming(false) }
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-6">
        <CredentialField label="Client ID" value={client.client_id} />
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Client secret</span>
          <div className="flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center border border-border bg-muted px-3 font-mono text-sm">
              <span aria-hidden="true">
                {client.public ? "–" : "••••••••••••••••"}
              </span>
              <span className="sr-only">
                {client.public
                  ? "Public client without a secret"
                  : "Stored hashed, can't be shown"}
              </span>
            </div>
            {!client.public && (
              <Button
                variant="outline"
                className="w-20"
                aria-expanded={isConfirming}
                aria-controls="rotate-secret-confirmation"
                onClick={() => setIsConfirming((current) => !current)}
              >
                Rotate
              </Button>
            )}
          </div>
        </div>
      </div>
      {isConfirming && (
        <div
          id="rotate-secret-confirmation"
          className="flex items-center justify-between gap-4 border border-border bg-muted/30 p-3 text-sm"
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">Rotate the client secret?</span>
            <span className="text-muted-foreground">
              The current secret stops working immediately. Every application
              using it has to be updated with the new one.
            </span>
            {rotation.isError && (
              <span className="text-destructive">{rotation.error.message}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={rotation.isPending}
              onClick={() => setIsConfirming(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={rotation.isPending}
              onClick={handleRotate}
            >
              Rotate secret
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientCredentials
