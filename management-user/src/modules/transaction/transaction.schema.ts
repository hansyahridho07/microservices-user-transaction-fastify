import { buildJsonSchemas } from 'fastify-zod'
import { z } from 'zod'
import { GeneralResponse, GeneralResponseSchema } from '../../helpers/GeneralResponse'

const detailDestinationCore = z.object({
  destination: z.string().min(1),
  type: z.enum(['Debit/Credit', 'Ewallet']),
  name_type: z.string().min(1),
})

const requestTransactionSchema = z.object({
  action: z.enum(['TOPUP', 'SEND', 'WITHDRAW']),
  wallet: z.boolean().default(false),
  account_id: z.number().min(1).nullable(),
  detail_destination: detailDestinationCore.optional(),
  amount: z.number().min(10),
  reff_id: z.string().min(1),
})

const detailAccountSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  type: z.enum(['Debit/Credit', 'Ewallet']),
  provider: z.string().min(1),
  admin_type: z.string().min(1),
  admin: z.number(),
  account_detail: z.any(),
})

const requestPaymentSchema = z.object({
  action: z.enum(['SEND', 'WITHDRAW', 'TOPUP']),
  reff_id: z.string().min(8),
  amount: z.number(),
  wallet: z.boolean().default(true),
  detail_account: detailAccountSchema.nullable(),
  detail_destination: detailDestinationCore.nullable(),
})

const findAllHistoryRequestSchema = z.object({
  action: z.enum(['SEND', 'WITHDRAW', 'TOPUP']).optional(),
  page: z.number().default(0).optional(),
  size: z.number().default(10).optional(),
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'REFUND']).optional(),
  reff_id: z.string().min(1).optional(),
})

const findAllHistoryResponseSchema = z.object({
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

export type RequestTransaction = z.infer<typeof requestTransactionSchema>
export type SchemaDetailDestination = z.infer<typeof detailDestinationCore>
export type RequestServiceTransaction = z.infer<typeof requestPaymentSchema>
export type RequestHistory = z.infer<typeof findAllHistoryRequestSchema>

export const { schemas: transactionSchema, $ref } = buildJsonSchemas(
  {
    requestTransactionSchema,
    GeneralResponseSchema,
    findAllHistoryRequestSchema,
    findAllHistoryResponseSchema
  },
  { $id: 'TransactionSchema' },
)
