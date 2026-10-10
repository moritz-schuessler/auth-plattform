import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

const useUpdateClient = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: {
      client_id: string
      update: {
        client_name?: string
        redirect_uris?: Array<string>
        post_logout_redirect_uris?: Array<string>
      }
    }) => {
      const response = await authClient.oauth2.updateClient(data)

      if (response.error) {
        throw new Error(response.error.message || "Update OAuth Client failed")
      }

      return response.data
    },
    onSuccess: async () => {
      await router.invalidate()
    },
  })
}

export default useUpdateClient
