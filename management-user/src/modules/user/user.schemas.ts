import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'
import { GeneralResponse } from '../../helpers/GeneralResponse'

const defaultUser = {
  email: z
    .string({
      required_error: 'email is required',
      invalid_type_error: 'email must be string',
    })
    .email('This is not valid email'),
  password: z
    .string({
      required_error: 'password is required',
      invalid_type_error: 'password must be string',
    })
    .min(8, { message: 'minimal input 8 character in property password' }),
}

const createUserSchema = z.object({
  ...defaultUser,
  name: z
    .string({
      required_error: 'name is required',
      invalid_type_error: 'name must be string',
    })
    .min(5, { message: 'minimal input 2 character in property name' }),
})

const createUserResponseSchema = z.object({
  ...GeneralResponse,
  data: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
})

const loginSchema = z.object({
  ...defaultUser,
})

const accessTokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  expires_at: z.number().optional(),
})

const loginResponseSchema = z.object({
  ...GeneralResponse,
  data: accessTokenSchema,
})

const dataUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  wallet: z.object({
    amount: z.number(),
  }),
})

const dataUserResponseSchema = z.object({
  ...GeneralResponse,
  data: dataUserSchema,
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateUserOutput = z.infer<typeof createUserResponseSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type LoginOutput = z.infer<typeof loginResponseSchema>
export type AccessTokenSchema = z.infer<typeof accessTokenSchema>
export type DataUserOutput = z.infer<typeof dataUserResponseSchema>
export type DataUserGetWallet = z.infer<typeof dataUserSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
    dataUserResponseSchema,
  },
  { $id: 'UserSchema' },
)
