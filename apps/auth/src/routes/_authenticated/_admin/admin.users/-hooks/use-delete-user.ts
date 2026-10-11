import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth/client/auth-client"

const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (data: { userId: string }) => {
      const response = await authClient.admin.removeUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Delete user failed")
      }

      return response.data
    },
  })
}

export default useDeleteUser
