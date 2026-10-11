import { z } from "zod"

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a name.")
    .max(100, "Use at most 100 characters."),
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
})

type CreateUserInput = z.infer<typeof createUserSchema>

export { createUserSchema }
export type { CreateUserInput }
