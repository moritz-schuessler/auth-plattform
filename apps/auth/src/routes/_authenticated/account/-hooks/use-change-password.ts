import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string
      newPassword: string
    }) => {
      const response = await authClient.changePassword({
        ...data,
        revokeOtherSessions: true,
      })

      if (response.error) {
        throw new Error(response.error.message || "Change password failed")
      }

      return response.data
    },
  })
}

export default useChangePassword
