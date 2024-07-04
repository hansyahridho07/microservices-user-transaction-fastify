import { FastifyReply, FastifyRequest } from 'fastify'
import { RequestHistory, RequestTransaction } from './transaction.schema'
import TransactionServices from './transaction.services'
import Producer from '../../helpers/MessageBroker/Producer'

class TransactionController {
  async transaction(
    request: FastifyRequest<{
      Body: RequestTransaction
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body
    const token = request.headers.authorization!
    try {
      const output = await TransactionServices.transaction(body, token)
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  async getHistoryTransaction(
    request: FastifyRequest<{
      Querystring: RequestHistory 
    }>,
    reply: FastifyReply,
  ) {
    const query = request.query
    const token = request.headers.authorization!
    try {
      const output = await TransactionServices.getHistoryTransaction(
        query,
        token,
      ) 
      return reply.code(output.statusCode).send(output)
    } catch (error) {
      console.error(error)
      return reply.code(500).send(error)
    }
  }

  async callbackMidtrans(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body
    await Producer(JSON.stringify(body), 'callback-midtrans')
    return reply.code(200).send({ success: true })
  }
}

export default new TransactionController()
