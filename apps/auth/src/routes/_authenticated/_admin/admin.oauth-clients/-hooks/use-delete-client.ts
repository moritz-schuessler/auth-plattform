import { useMutation } from "@tanstack/react-query"
import useClientSecret from "./use-client-secret"
import { authClient } from "@/lib/auth/client/auth-client"

const useDeleteClient = () => {
  const { clientSecret, setClientSecret } = useClientSecret()

  return useMutation({
    mutationFn: async (clientId: string) => {
      const response = await authClient.oauth2.deleteClient({
        client_id: clientId,
      })

      if (response.error) {
        throw new Error(response.error.message || "Delete OAuth Client failed")
      }

      return clientId
    },
    onSuccess: (clientId) => {
      if (clientSecret?.client_id === clientId) {
        setClientSecret(null)
      }
    },
  })
}

export default useDeleteClient
