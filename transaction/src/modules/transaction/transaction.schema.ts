import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'
import { requestCore } from '../../helpers/Axios'
import { GeneralResponse } from '../../helpers/GeneralResponse'

const detailAccountSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.enum(["Debit/Credit","Ewallet"]),
  provider: z.string().min(1),
  admin_type: z.string().min(1),
  admin: z.number(),
  account_detail: z.any()
})

const detailDestinationSchema = z.object({
  destination: z.string().min(1),
  type: z.enum(["Debit/Credit","Ewallet"]),
  name_type: z.string().min(1),
})

const requestPaymentSchema = z.object({
  action: z.enum(['SEND', 'WITHDRAW', 'TOPUP']),
  reff_id: z.string().min(8),
  amount: z.number(),
  wallet: z.boolean().default(true),
  detail_account: detailAccountSchema
    .nullable(),
  detail_destination: detailDestinationSchema
    .nullable(),
})

const requestPaymentGateway = z.object({
  type: z.enum(["Debit/Credit","Ewallet"]),
  amount: z.number().min(1),
  name: z.string(),
  reff_id: z.string()
})

const responseMidransSchema = z.object({
  ...GeneralResponse,
  data: z.object({
    method: z.string(),
    link_payment: z.string(),
    information: z.string(),
    request: requestCore.optional(),
    response: z.any()
  }).nullable()
})

const responseHistorySchema = z.object({
  ...GeneralResponse,
})

const findAllDataSchema = z.object({
  action: z.enum(['SEND', 'WITHDRAW', 'TOPUP']).optional(),
  page: z.number().default(0).optional(),
  size: z.number().default(0).optional(),
  status: z.enum(["PENDING","SUCCESS","FAILED","REFUND"]).optional(),
  reff_id: z.string().min(1).optional()
})

const findAllDataResponseSchema = z.object({
  ...GeneralResponse,
  data: z.object({
    data: z.array(z.object({
        "id": z.number(),
        "reff_id": z.string(),
        "action": z.string(),
        "type": z.string(),
        "status": z.enum(["PENDING","SUCCESS","FAILED","EXPIRED"]),
        "amount": z.number(),
        "admin": z.number(),
        "total": z.number(),
        "currency": z.string(),
        "created_at": z.date(),
        "updated_at": z.date()
    })),
    meta: z.object({
      "total": z.number(),
      "lastPage": z.number(),
      "currentPage": z.number(),
      "perPage": z.number(),
      "prev": z.number().or(z.null()),
      "next": z.number().or(z.null())
    })
  })
})

export type RequestPaymentGateway = z.infer<typeof requestPaymentGateway>
export type RequestTransactionSchema = z.infer<typeof requestPaymentSchema>
export type DetailDestinationSchema = z.infer<typeof detailDestinationSchema>
export type DetailAccountSchema = z.infer<typeof detailAccountSchema>
export type OutputMidtrans = z.infer<typeof responseMidransSchema>
export type RequestHistory = z.infer<typeof findAllDataSchema>

export const { schemas: transactionSchema, $ref } = buildJsonSchemas(
  {
    requestPaymentSchema,
    responseMidransSchema,
    findAllDataSchema,
    findAllDataResponseSchema
  },
  { $id: 'TransactionSchema' },
)
