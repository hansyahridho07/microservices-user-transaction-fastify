import { FastifyReply, FastifyRequest } from 'fastify'
import UserService from './user.services'
import { CreateUserInput, LoginInput } from './user.schemas'

export default class UserController {
  static async register(
    request: FastifyRequest<{
      Body: CreateUserInput
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    try {
      const output = await UserService.register(body)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async login(
    request: FastifyRequest<{
      Body: LoginInput
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    try {
      const output = await UserService.login(body)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async getUser(request: FastifyRequest, reply: FastifyReply) {
    const access_token = request.headers.authorization!
    const jwt = request.user
    try {
      const output = await UserService.getDataUser(jwt, access_token)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async siteSuccessValidation(request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({success: true, statusCode:200,message: "success verification email", data:null})
  }
}
