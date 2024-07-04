import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateAccountInput,
  DeleteAccountInput,
  UpdateAccountInput,
} from './account.schemas'
import AccountService from './account.services'

export default class AccountController {
  static async createAccount(
    request: FastifyRequest<{
      Body: CreateAccountInput
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    const resultJwt = request.user
    try {
      const output = await AccountService.createAccount(body, resultJwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async getPaymentList(_: FastifyRequest, reply: FastifyReply) {
    try {
      const output = await AccountService.getPaymentList()
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async getAccountPayment(request: FastifyRequest, reply: FastifyReply) {
    const dataJwt = request.user
    try {
      const output = await AccountService.getAccountPayment(dataJwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async updateAccount(
    request: FastifyRequest<{
      Body: UpdateAccountInput
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    const dataJwt = request.user
    try {
      const output = await AccountService.updateAccount(body, dataJwt)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  static async deleteAccount(
    request: FastifyRequest<{
      Querystring: DeleteAccountInput
    }>,
    reply: FastifyReply,
  ) {
    const query = request.query
    const dataJwt = request.user
    try {
      const output = await AccountService.deleteAccount(query, dataJwt)
      return reply.code(200).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }
}
