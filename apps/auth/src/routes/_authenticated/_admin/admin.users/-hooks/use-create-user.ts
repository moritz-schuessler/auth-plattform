import { useMutation } from "@tanstack/react-query"
import type { CreateUserInput } from "../-schemas/create-user"
import { authClient } from "@/lib/auth/client/auth-client"

const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await authClient.admin.createUser(data)

      if (response.error) {
        throw new Error(response.error.message || "Create user failed")
      }

      return response.data
    },
  })
}

export default useCreateUser
