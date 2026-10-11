import { useMutation } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { authClient } from "@/lib/auth/client/auth-client"

const useUpdateUser = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: {
      userId: string
      data: {
        name?: string
        email?: string
      }
    }) => {
      const response = await authClient.admin.updateUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Update user failed")
      }

      return response.data
    },
    onSuccess: async () => {
      await router.invalidate()
    },
  })
}

export default useUpdateUser
