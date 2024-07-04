import { FastifyJWT } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import {
  GeneralOutput,
  GeneralResponseOutput,
} from '../helpers/GeneralResponse'
import { UserPayload } from '../helpers/types.helper'

export default async function (req: FastifyRequest, reply: FastifyReply) {
  let errorResponse: GeneralOutput
  if (!req.headers.authorization) {
    errorResponse = GeneralResponseOutput(
      false,
      400,
      'Authorization is required',
    ).output()
    return reply.status(errorResponse.statusCode).send(errorResponse)
  }
  const accessToken = req.headers.authorization.split(' ')
  if (accessToken.length !== 2) {
    errorResponse = GeneralResponseOutput(
      false,
      400,
      'Invalid header Authorization',
    ).output()
    return reply.status(errorResponse.statusCode).send(errorResponse)
  }
  if (accessToken[0] !== 'Bearer') {
    errorResponse = GeneralResponseOutput(
      false,
      400,
      'Invalid access token',
    ).output()
    return reply.status(errorResponse.statusCode).send(errorResponse)
  }

  const token = accessToken[1]
  try {
    const decoded = req.jwt.verify<FastifyJWT['result']>(token)
    const output: UserPayload = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.user_metadata.name,
    }
    req.user = output
  } catch (error: any) {
    errorResponse = GeneralResponseOutput(false, 401, error.message).output()
    return reply.status(errorResponse.statusCode).send(errorResponse)
  }
}
