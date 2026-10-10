import { useMutation } from "@tanstack/react-query"
import useClientSecret from "./use-client-secret"
import { authClient } from "@/lib/auth/client/auth-client"

const useRotateSecret = () => {
  const { setClientSecret } = useClientSecret()

  return useMutation({
    mutationFn: async (data: { client_id: string; client_name: string }) => {
      const response = await authClient.oauth2.client.rotateSecret({
        client_id: data.client_id,
      })

      if (response.error || !response.data.client_secret) {
        throw new Error(response.error?.message || "Rotate secret failed")
      }

      return { ...data, client_secret: response.data.client_secret }
    },
    onSuccess: (client) => {
      setClientSecret({ reason: "rotated", ...client })
    },
    gcTime: 0,
  })
}

export default useRotateSecret
