import { z } from "zod"

const isLoopbackHost = (hostname: string) => {
  const host = hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "")

  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "::1" ||
    /^127(\.\d{1,3}){3}$/.test(host)
  )
}

const getUrlError = (value: string) => {
  if (!URL.canParse(value)) {
    return "Enter a valid URL, for example https://app.example.com."
  }

  const url = new URL(value)

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return "The URL must start with https:// (or http:// for localhost)."
  }

  if (value.includes("#")) {
    return "The URL must not contain a fragment (#)."
  }

  if (url.protocol === "http:" && !isLoopbackHost(url.hostname)) {
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

const clientNameSchema = z
  .string()
  .trim()
  .min(1, "Enter an application name.")
  .max(100, "Use at most 100 characters.")

const createClientSchema = z.object({
  client_name: clientNameSchema,
  redirect_uri: z
    .string()
    .trim()
    .min(1, "Enter a redirect URL.")
    .superRefine(validateUrl),
  post_logout_redirect_uri: z.string().trim().superRefine(validateUrl),
})

type CreateClientInput = z.infer<typeof createClientSchema>

export { clientNameSchema, createClientSchema, getUrlError }
export type { CreateClientInput }
