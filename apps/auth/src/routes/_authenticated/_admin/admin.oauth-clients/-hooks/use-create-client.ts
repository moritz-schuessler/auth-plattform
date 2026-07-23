import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useCreateClient = () => {
  return useMutation({
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
  })
}

export default useCreateClient
