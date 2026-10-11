import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async (data: { password: string }) => {
      const response = await authClient.deleteUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Delete account failed")
      }

      return response.data
    },
  })
}

export default useDeleteAccount
