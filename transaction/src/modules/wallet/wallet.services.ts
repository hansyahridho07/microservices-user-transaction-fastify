import { Prisma, Wallet } from '@prisma/client'
import prisma from '../../helpers/Prisma'
import { QueryBuilder } from '../../helpers/QueryBuilder'
import { RequestCreateWalletRabbitMQ, RequestGetWallet } from './wallet.schema'
import { UserPayload } from '../../helpers/types.helper'
import { GeneralResponseOutput } from '../../helpers/GeneralResponse'
class WalletService {
  async createWallet(input: RequestCreateWalletRabbitMQ): Promise<void> {
    const argumentWhere: Prisma.WalletFindFirstArgs = {
      where: { user_id: input.userId },
    }

    const checkWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
      prisma.wallet,
      argumentWhere,
    )

    if (!checkWallet) {
      const argument: Prisma.WalletCreateInput = {
        user_id: input.userId,
        amount: 0,
      }
      await QueryBuilder.createQuery<Wallet>(prisma.wallet, argument)
    }

    console.log('=====SUCCESS CREATE WALLET USER=====')
  }

  async getWallet(input: UserPayload) {
    const argumentWhere: Prisma.WalletFindFirstArgs = {
      where: { user_id: input.id },
    }
    const result = await QueryBuilder.findOneByParameterQuery<Wallet>(
      prisma.wallet,
      argumentWhere,
    )

    return result
      ? GeneralResponseOutput(true, 200, 'success', result).output()
      : GeneralResponseOutput(false, 404, 'user not found').output()
  }
}

export default new WalletService()
