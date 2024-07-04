import { z } from 'zod'
import { GeneralResponse } from '../../helpers/GeneralResponse'
import { buildJsonSchemas } from 'fastify-zod'

const requestSchema = {
  userId: z.string(),
}

const requestCreateWalletRabbitMq = z.object({
  ...requestSchema,
})

const requestGetWallet = z.object({
  ...requestSchema,
})

const responseGetWallet = z.object({
  ...GeneralResponse,
  data: z.object({
    id: z.number(),
    user_id: z.string(),
    amount: z.number(),
  }),
})

export type RequestCreateWalletRabbitMQ = z.infer<
  typeof requestCreateWalletRabbitMq
>
export type RequestGetWallet = z.infer<typeof requestGetWallet>
export type ResponseGetWallet = z.infer<typeof responseGetWallet>

export const { schemas: walletSchemas, $ref } = buildJsonSchemas(
  {
    responseGetWallet,
  },
  { $id: 'WalletSchema' },
)
