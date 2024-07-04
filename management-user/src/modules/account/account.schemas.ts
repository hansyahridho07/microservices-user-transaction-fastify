import { Payment_Method } from '@prisma/client'
import { z } from 'zod'
import { GeneralResponse } from '../../helpers/GeneralResponse'
import { buildJsonSchemas } from 'fastify-zod'

const debitCreditAccountData = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  holderName: z.string().min(1, 'Holder name is required'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
})
const otherAccountData = z.object({
  account_number: z.string(),
})

const createAccountRequestSchema = z.object({
  payment_id: z.number(),
  name: z.string(),
  account_info: z.object({
    debit_credit: z.optional(debitCreditAccountData),
    other: z.optional(otherAccountData),
  }),
  // status: z.boolean()
})

const updateAccountRequestSchema = z.object({
  id: z.number(),
  payment_id: z.number().optional(),
  name: z.string().optional(),
  account_info: z
    .object({
      debit_credit: z.optional(debitCreditAccountData),
      other: z.optional(otherAccountData),
    })
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

const createAccountResponseSchema = z.object({
  ...GeneralResponse,
  data: z.null()
})

const responseListPaymentMethod = z.object({
  ...GeneralResponse,
  data: z.array(z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    provider: z.string(),
    status: z.enum(["ACTIVE","INACTIVE"]),
    admin_type: z.enum(["PERCENTAGE","FIX"]),
    admin: z.number()
  }))
})

const updateAccountResponseSchema = z.object({
  ...GeneralResponse,
  data: z.null()
})

const responseListPaymentRegisteredSchema = z.object({
  ...GeneralResponse,
  data: z.array(z.object({
    id: z.number(),
    payment: z.object({
      id: z.number(),
      name: z.string(),
      type: z.string()
    }),
    account_info: z.object({
      cvv: z.string().optional(),
      cardNumber: z.string().optional(),
      expiryDate: z.string().optional(),
      holderName: z.string().optional(),
      account_number: z.string().optional()
    }),
    status: z.enum(["ACTIVE","INACTIVE"])
  }))
})

const deleteResponseSchema = z.object({
  ...GeneralResponse,
  data: z.null()
})

const deleteRequestSchema = z.object({
  account_id: z.number(),
})

export type DebitCreditData = z.infer<typeof debitCreditAccountData>
export type OtherData = z.infer<typeof otherAccountData>
export type CreateAccountInput = z.infer<typeof createAccountRequestSchema>
export type CreateAccountOutput = z.infer<typeof createAccountResponseSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountRequestSchema>
export type DeleteAccountInput = z.infer<typeof deleteRequestSchema>

export const { schemas: accountSchema, $ref } = buildJsonSchemas(
  {
    createAccountRequestSchema,
    createAccountResponseSchema,
    responseListPaymentMethod,
    responseListPaymentRegisteredSchema,
    updateAccountRequestSchema,
    updateAccountResponseSchema,
    deleteRequestSchema,
    deleteResponseSchema
  },
  { $id: 'AccountSchema' },
)
