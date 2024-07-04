import { GeneralOutput } from './../../helpers/GeneralResponse'
import {
  AccessTokenSchema,
  CreateUserInput,
  CreateUserOutput,
  DataUserGetWallet,
  DataUserOutput,
  LoginInput,
  LoginOutput,
} from './user.schemas'
import supabase from '../../helpers/Supabase'
import { GeneralResponseOutput } from '../../helpers/GeneralResponse'
import { QueryBuilder } from '../../helpers/QueryBuilder'
import { Prisma, User } from '@prisma/client'
import prisma from '../../helpers/Prisma'
import Producer from '../../helpers/MessageBroker/Producer'
import { UserPayload } from '../../helpers/types.helper'
import { AxiosCustom, RequestCustomAxios } from '../../helpers/Axios'

type ArgumentsUser = {
  where: Prisma.UserWhereUniqueInput
  select: Prisma.UserSelect
}

export default class UserService {
  static async register(
    input: CreateUserInput,
  ): Promise<GeneralOutput | CreateUserOutput> {
    const argsCheckUser: ArgumentsUser = {
      where: { email: input.email },
      select: { email: true, status: true },
    }

    const checkUser = await QueryBuilder.findOneByParameterQuery<User>(
      prisma.user,
      argsCheckUser,
    )

    // check email already registered and already click email confirmation in mailbox
    if (checkUser && checkUser.status === 'ACTIVE') {
      return GeneralResponseOutput(
        true,
        200,
        'Email already registered',
      ).output()
    }
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
        },
      },
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      console.error('======ERROR CREATE USER SUPABASE=======')
      return GeneralResponseOutput(false, 400, error.message).output()
    }

    const createUser: Prisma.UserCreateInput = {
      id: data.user!.id,
      email: input.email,
      name: input.name,
      status: 'INACTIVE',
    }

    const user = await QueryBuilder.createQuery<User>(prisma.user, createUser)

    const output: CreateUserOutput = {
      success: true,
      message: 'success created user, please check your email for confirmation',
      statusCode: 201,
      data: { ...user },
    }

    await Producer(JSON.stringify({ userId: createUser.id }), 'create-wallet')
    return output
  }

  static async login(input: LoginInput): Promise<GeneralOutput | LoginOutput> {
    const argsCheckUser: ArgumentsUser = {
      where: { email: input.email },
      select: { email: true },
    }

    const checkUser = await QueryBuilder.findOneByParameterQuery<User>(
      prisma.user,
      argsCheckUser,
    )

    // not yet registered
    if (!checkUser) {
      return GeneralResponseOutput(false, 404, 'Not yet registered').output()
    }

    let { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      console.error('======ERROR LOGIN SUPABASE=======')
      return GeneralResponseOutput(false, 400, error.message).output()
    }

    const updateUser: Prisma.UserUpdateArgs = {
      where: { email: input.email },
      data: { status: 'ACTIVE' },
    }

    await QueryBuilder.updateQuery(prisma.user, updateUser)
    const access_token: AccessTokenSchema = {
      access_token: data.session!.access_token,
      token_type: data.session!.token_type,
      expires_in: data.session!.expires_in,
      expires_at: data.session!.expires_at,
    }

    const output: LoginOutput = {
      success: true,
      message: 'success login',
      statusCode: 200,
      data: { ...access_token },
    }

    return output
  }

  static async getDataUser(jwt: UserPayload, access_token: string) {
    const url_transaction: string = process.env.URL_SERVICE_TRANSACTION!
    const path = '/api/v1/wallet'
    const requestAxios: RequestCustomAxios = {
      access_token: access_token,
      url: url_transaction,
      path: path,
    }

    const result = await AxiosCustom.getRequest(requestAxios)

    if (!result.success) {
      return result
    }

    const dataUser: DataUserGetWallet = {
      ...jwt,
      wallet: {
        amount: result.data.amount,
      },
    }

    const outputData: DataUserOutput = {
      success: true,
      statusCode: 200,
      message: 'success',
      data: dataUser,
    }
    return outputData
  }
}
