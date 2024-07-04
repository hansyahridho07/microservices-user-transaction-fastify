import { FastifyInstance } from 'fastify'
import UserController from './user.controllers'
import { $ref } from './user.schemas'

export default async function routes(route: FastifyInstance) {
  route.post(
    '/register',
    {
      schema: {
        tags: ["User"],
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema'),
        },
      },
    },
    UserController.register,
  )

  route.post(
    '/login',
    {
      // preHandler: [route.authenticate],
      schema: {
        tags: ["User"],
        body: $ref('loginSchema'),
        response: {
          200: $ref('loginResponseSchema')
        },
      },
    },
    UserController.login,
  )

  route.get(
    '/',
    {
      preHandler: [route.authenticate],
      schema: {
        tags: ["User"],
        headers: {
          Authorization: {
            type: "string"
          }
        },
        response: {
          200: $ref('dataUserResponseSchema'),
        },
      },
    },
    UserController.getUser,
  )

  route.get('/success', {
    schema: {
      tags: ["External needs"]
    }
  }, UserController.siteSuccessValidation)
}
