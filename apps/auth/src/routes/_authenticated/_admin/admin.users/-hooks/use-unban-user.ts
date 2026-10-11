import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useUnbanUser = () => {
  return useMutation({
    mutationFn: async (data: { userId: string }) => {
      const response = await authClient.admin.unbanUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Unban user failed")
      }

      return response.data
    },
  })
}

export default useUnbanUser
