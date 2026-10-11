import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useBanUser = () => {
  return useMutation({
    mutationFn: async (data: {
      userId: string
      banReason?: string
      banExpiresIn?: number
    }) => {
      const response = await authClient.admin.banUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Ban user failed")
      }

      return response.data
    },
  })
}

export default useBanUser
