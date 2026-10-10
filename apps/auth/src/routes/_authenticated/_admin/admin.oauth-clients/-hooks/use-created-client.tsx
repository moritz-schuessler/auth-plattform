import { createContext, useContext, useState } from "react"
import type { PropsWithChildren } from "react"

interface CreatedClient {
  client_id: string
  client_secret?: string
  client_name: string
}

interface CreatedClientContextValue {
  createdClient: CreatedClient | null
  setCreatedClient: (client: CreatedClient | null) => void
}

const CreatedClientContext = createContext<CreatedClientContextValue | null>(
  null
)

const CreatedClientProvider = ({ children }: PropsWithChildren) => {
  const [createdClient, setCreatedClient] = useState<CreatedClient | null>(null)

  return (
    <CreatedClientContext value={{ createdClient, setCreatedClient }}>
      {children}
    </CreatedClientContext>
  )
}

const useCreatedClient = () => {
  const context = useContext(CreatedClientContext)

  if (!context) {
    throw new Error(
      "useCreatedClient must be used within CreatedClientProvider"
    )
  }

  return context
}

export { CreatedClientProvider }
export type { CreatedClient }
export default useCreatedClient
