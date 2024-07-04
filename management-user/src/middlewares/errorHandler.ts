import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export default function (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.error(error)
  console.log('MASUK KE MIDDLEWARE ERROR')
}
