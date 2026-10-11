import { createContext, useContext, useState } from "react"
import type { PropsWithChildren } from "react"

interface ClientSecret {
  reason: "created" | "rotated"
  client_id: string
  client_name: string
  client_secret: string
}

interface ClientSecretContextValue {
  clientSecret: ClientSecret | null
  setClientSecret: (clientSecret: ClientSecret | null) => void
}

const ClientSecretContext = createContext<ClientSecretContextValue | null>(null)

const ClientSecretProvider = ({ children }: PropsWithChildren) => {
  const [clientSecret, setClientSecret] = useState<ClientSecret | null>(null)

  return (
    <ClientSecretContext value={{ clientSecret, setClientSecret }}>
      {children}
    </ClientSecretContext>
  )
}

const useClientSecret = () => {
  const context = useContext(ClientSecretContext)

  if (!context) {
    throw new Error("useClientSecret must be used within ClientSecretProvider")
  }

  return context
}

export { ClientSecretProvider }
export type { ClientSecret }
export default useClientSecret
