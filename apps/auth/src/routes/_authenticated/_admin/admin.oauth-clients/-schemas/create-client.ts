import { z } from "zod"

const loopbackHosts = ["localhost", "127.0.0.1", "[::1]"]

const forbiddenProtocols = ["javascript:", "data:", "vbscript:"]

const getUrlError = (value: string) => {
  if (!URL.canParse(value)) {
    return "Enter a valid URL, for example https://app.example.com."
  }

  const url = new URL(value)

  if (forbiddenProtocols.includes(url.protocol)) {
    return "This URL scheme isn't allowed."
  }

  if (value.includes("#")) {
    return "The URL must not contain a fragment (#)."
  }

  if (url.protocol === "http:" && !loopbackHosts.includes(url.hostname)) {
    return "Use HTTPS. HTTP is only allowed for localhost."
  }

  return null
}

const validateUrl = (value: string, context: z.RefinementCtx) => {
  const message = value ? getUrlError(value) : null

  if (message) {
    context.addIssue({ code: "custom", message })
  }
}

const createClientSchema = z.object({
  client_name: z
    .string()
    .trim()
    .min(1, "Enter an application name.")
    .max(100, "Use at most 100 characters."),
  redirect_uri: z
    .string()
    .trim()
    .min(1, "Enter a redirect URL.")
    .superRefine(validateUrl),
  post_logout_redirect_uri: z.string().trim().superRefine(validateUrl),
})

type CreateClientInput = z.infer<typeof createClientSchema>

export { createClientSchema }
export type { CreateClientInput }
