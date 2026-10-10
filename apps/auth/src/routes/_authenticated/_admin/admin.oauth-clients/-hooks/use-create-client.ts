import { useMutation } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { createClientSchema } from "../-schemas/create-client"
import useClientSecret from "./use-client-secret"
import type { CreateClientInput } from "../-schemas/create-client"
import { auth } from "@/lib/auth/server/auth"
import { requireAdmin } from "@/lib/auth/server/guards"

const createOAuthClient = createServerFn({ method: "POST" })
  .inputValidator(createClientSchema)
  .handler(async ({ data }) => {
    await requireAdmin()

    const headers = getRequestHeaders()

    const client = await auth.api.adminCreateOAuthClient({
      headers,
      body: {
        client_name: data.client_name,
        redirect_uris: [data.redirect_uri],
        skip_consent: true,
      },
    })

    return {
      client_id: client.client_id,
      client_secret: client.client_secret,
    }
  })

const useCreateClient = () => {
  const { setClientSecret } = useClientSecret()

  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const client = await createOAuthClient({ data })

      return { ...client, client_name: data.client_name }
    },
    onSuccess: ({ client_secret, ...client }) => {
      if (client_secret) {
        setClientSecret({ reason: "created", ...client, client_secret })
      }
    },
    gcTime: 0,
  })
}

export default useCreateClient
