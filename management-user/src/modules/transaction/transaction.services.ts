import {
  GeneralOutput,
  GeneralResponseOutput,
} from '../../helpers/GeneralResponse'
import {
  RequestHistory,
  RequestServiceTransaction,
  RequestTransaction,
  SchemaDetailDestination,
} from './transaction.schema'
import { Prisma, User_Account } from '@prisma/client'
import prisma from '../../helpers/Prisma'
import axios, { AxiosRequestConfig } from 'axios'

type ArgumentUserAccount = {
  where: Prisma.User_AccountWhereUniqueInput
  include: Prisma.User_AccountInclude
}

type TopUp = {
  account_id: number
  amount: number
  access_token: string
  reff_id: string
}

class TransacrtionService {
  public async transaction(input: RequestTransaction, token: string) {
    let output: GeneralOutput
    switch (input.action) {
      case 'TOPUP':
        const request: TopUp = {
          account_id: input.account_id!,
          access_token: token,
          amount: input.amount,
          reff_id: input.reff_id,
        }
        output = await this.topup(request, token)
        break
      case 'WITHDRAW':
        output = await this.withdraw(input, token)
        break
      default:
        output = await this.send(input, token)
        break
    }
    return output
  }

  private async topup(input: TopUp, token: string) {
    const getAccountUser = await prisma.user_Account.findFirst({
      where: { id: input.account_id },
      include: {
        payment: true,
      },
    })

    if (!getAccountUser) {
      return GeneralResponseOutput(false, 404, 'account not found').output()
    }

    if (getAccountUser.status === 'INACTIVE') {
      return GeneralResponseOutput(false, 400, 'account is inactive').output()
    }

    const requestTopup: RequestServiceTransaction = {
      action: 'TOPUP',
      amount: input.amount,
      detail_account: {
        id: getAccountUser.payment.id,
        type:
          getAccountUser.payment.type === 'Debit/Credit'
            ? 'Debit/Credit'
            : 'Ewallet',
        provider: getAccountUser.payment.provider,
        name: getAccountUser.payment.name,
        admin: 0,
        admin_type: 'FIX',
        account_detail: getAccountUser.account_info,
      },
      reff_id: input.reff_id,
      detail_destination: null,
      wallet: false,
    }

    const url = process.env.URL_SERVICE_TRANSACTION!
    const path = '/api/v1/transaction'
    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: { ...requestTopup },
    }

    try {
      const response = await axios(config)
      const output = response.data as GeneralOutput
      return output
    } catch (error: any) {
      console.error('=====ERROR IN AXIOS=====')
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }

  private async send(input: RequestTransaction, token: string) {
    let requestSend: RequestServiceTransaction
    if (input.wallet) {
      requestSend = {
        action: 'SEND',
        amount: input.amount,
        detail_account: null,
        reff_id: input.reff_id,
        detail_destination: input.detail_destination!,
        wallet: true,
      }
    } else {
      const getAccountUser = await prisma.user_Account.findFirst({
        where: { id: input.account_id! },
        include: {
          payment: true,
        },
      })

      if (!getAccountUser) {
        return GeneralResponseOutput(false, 404, 'account not found').output()
      }

      if (getAccountUser.status === 'INACTIVE') {
        return GeneralResponseOutput(false, 400, 'account is inactive').output()
      }

      requestSend = {
        action: 'SEND',
        amount: input.amount,
        detail_account: {
          id: getAccountUser.payment.id,
          type:
            getAccountUser.payment.type === 'Debit/Credit'
              ? 'Debit/Credit'
              : 'Ewallet',
          provider: getAccountUser.payment.provider,
          name: getAccountUser.payment.name,
          admin: getAccountUser.payment.admin,
          admin_type: getAccountUser.payment.admin_type,
          account_detail: getAccountUser.account_info,
        },
        reff_id: input.reff_id,
        detail_destination: input.detail_destination!,
        wallet: false,
      }
    }

    const url = process.env.URL_SERVICE_TRANSACTION!
    const path = '/api/v1/transaction'
    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: { ...requestSend },
    }

    try {
      const response = await axios(config)
      const output = response.data as GeneralOutput
      return output
    } catch (error: any) {
      console.error('=====ERROR IN AXIOS=====')
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }

  private async withdraw(input: RequestTransaction, token: string) {
    if (!input.wallet) {
      return GeneralResponseOutput(
        false,
        400,
        'property wallet must be true',
      ).output()
    }

    const requestSend: RequestServiceTransaction = {
      action: 'WITHDRAW',
      reff_id: input.reff_id,
      amount: input.amount,
      wallet: true,
      detail_account: null,
      detail_destination: null,
    }

    const url = process.env.URL_SERVICE_TRANSACTION!
    const path = '/api/v1/transaction'
    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: { ...requestSend },
    }

    try {
      const response = await axios(config)
      const output = response.data as GeneralOutput
      return output
    } catch (error: any) {
      console.error('=====ERROR IN AXIOS=====')
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }

  public async getHistoryTransaction(payload: RequestHistory, token: string) {
    const url = process.env.URL_SERVICE_TRANSACTION!
    const path = '/api/v1/transaction/history'
    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'GET',
      headers: {
        Authorization: token,
      },
      params: { ...payload },
    }

    try {
      const response = await axios(config)
      const output = response.data as GeneralOutput
      return output
    } catch (error: any) {
      console.error('=====ERROR IN AXIOS=====')
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }
}

export default new TransacrtionService()
