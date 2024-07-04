import { FastifyInstance } from 'fastify'
import AccountController from './account.controllers'
import { $ref } from './account.schemas'
import { GeneralResponseOutput } from '../../helpers/GeneralResponse'

export default async function routes(route: FastifyInstance) {
  route.post(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Account"],
        body: $ref('createAccountRequestSchema'),
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          201: $ref('createAccountResponseSchema'),
        },
      },
    },
    AccountController.createAccount,
  )

  route.get(
    '/payment-list',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Account"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref("responseListPaymentMethod")
        }
      },
    },
    AccountController.getPaymentList,
  )

  route.get(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Account"],
        description: "Get all payment channel that the user has registered",
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref('responseListPaymentRegisteredSchema')
        }
      },
    },
    AccountController.getAccountPayment,
  )

  route.put(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Account"],
        body: $ref('updateAccountRequestSchema'),
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref('createAccountResponseSchema'),
        },
      },
    },
    AccountController.updateAccount,
  )

  route.delete(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["Account"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        querystring: {
          account_id: { type: 'string'  },
        },
        response: {
          200: $ref('deleteResponseSchema'),
        },
      },
    },
    AccountController.deleteAccount,
  )
}
