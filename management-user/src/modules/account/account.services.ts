import {
  GeneralOutput,
  GeneralResponseOutput,
} from '../../helpers/GeneralResponse'
import { QueryBuilder } from '../../helpers/QueryBuilder'
import { Payment_Method, Prisma, User_Account } from '@prisma/client'
import prisma from '../../helpers/Prisma'
import {
  CreateAccountInput,
  CreateAccountOutput,
  DebitCreditData,
  DeleteAccountInput,
  OtherData,
  UpdateAccountInput,
} from './account.schemas'
import { UserPayload } from '../../helpers/types.helper'
import EncryptDecrypt from '../../helpers/EncryptDecrypt'

type ArgumentsPaymentMethod = {
  where: Prisma.Payment_MethodWhereUniqueInput
}

type ArgumentUserAccount = {
  where: Prisma.User_AccountWhereUniqueInput
}

type User_AccountWhere = {
  where: Prisma.User_AccountWhereInput
  select: Prisma.User_AccountSelect
}

export default class AccountService {
  public static async createAccount(
    input: CreateAccountInput,
    jwt: UserPayload,
  ): Promise<CreateAccountOutput> {
    const argsCheckPaymentMethod: ArgumentsPaymentMethod = {
      where: { id: input.payment_id },
    }

    if (!input.account_info.debit_credit && !input.account_info.other) {
      return GeneralResponseOutput(
        false,
        400,
        'one of the property account_info must be filled',
      ).output()
    }

    // check data payment method
    const getPaymentMethod =
      await QueryBuilder.findOneByParameterQuery<Payment_Method>(
        prisma.payment_Method,
        argsCheckPaymentMethod,
      )

    if (!getPaymentMethod)
      return GeneralResponseOutput(
        false,
        400,
        'Payment method not registered',
      ).output()

    if (!input.account_info.debit_credit ||
        Object.keys(input.account_info.debit_credit).length === 0
    ) {
      if(getPaymentMethod.type === 'Debit/Credit'){
        return GeneralResponseOutput(
          false,
          400,
          'payment with Debit/Credit must input field account_info/debit_credit',
        ).output()
      }
    }

    if (!input.account_info.other ||
      Object.keys(input.account_info.other).length === 0
    ) {
      if(getPaymentMethod.type !== 'Debit/Credit'){
        return GeneralResponseOutput(
          false,
          400,
          'payment with Ewallet must input field account_info/other',
        ).output()
      }
    }

    let dataAcountInfo: Prisma.InputJsonValue = {}
    if (getPaymentMethod.type === 'Debit/Credit') {
      const dataDebitOrCredit: DebitCreditData = {
        ...input.account_info.debit_credit!,
      }
      try {
        dataDebitOrCredit.cardNumber = EncryptDecrypt.encrypt(
          dataDebitOrCredit.cardNumber,
        )
        dataDebitOrCredit.cvv = EncryptDecrypt.encrypt(dataDebitOrCredit.cvv)
        dataDebitOrCredit.expiryDate = EncryptDecrypt.encrypt(
          dataDebitOrCredit.expiryDate,
        )
        dataDebitOrCredit.holderName = EncryptDecrypt.encrypt(
          dataDebitOrCredit.holderName,
        )
      } catch (error) {
        console.error('ERROR ENCRYPT DEBIT/CREDIT CARD')
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
      dataAcountInfo = { ...dataDebitOrCredit }
    } else {
      const dataOther: OtherData = { ...input.account_info.other! }
      try {
        dataOther.account_number = EncryptDecrypt.encrypt(
          dataOther.account_number,
        )
      } catch (error) {
        console.error('ERROR ENCRYPT OTHER DATA')
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
      dataAcountInfo = { ...dataOther }
    }

    const dataUserAccount: Prisma.User_AccountUncheckedCreateInput = {
      name: input.name,
      account_info: dataAcountInfo!,
      status: 'ACTIVE',
      user_id: jwt.id,
      payment_id: input.payment_id,
    }

    await QueryBuilder.createQuery<User_Account>(
      prisma.user_Account,
      dataUserAccount,
    )

    const output: CreateAccountOutput = {
      success: true,
      statusCode: 201,
      message: `success create account ${getPaymentMethod.name}`,
      data: null
    }

    return output
  }

  public static async getPaymentList(): Promise<GeneralOutput> {
    const argument: Prisma.Payment_Method$user_accountArgs = {
      where: { status: 'ACTIVE' },
    }
    const output = await QueryBuilder.findAllQuery<Payment_Method>(
      prisma.payment_Method,
      argument,
    )
    return GeneralResponseOutput(true, 200, 'success', output).output()
  }

  public static async getAccountPayment(
    jwt: UserPayload,
  ): Promise<GeneralOutput> {
    const argument: User_AccountWhere = {
      where: { user_id: jwt.id },
      select: {
        id: true,
        payment: {
          select: { id: true, name: true, type: true },
        },
        account_info: true,
        status: true,
      },
    }

    const userAccount = await QueryBuilder.findAllQuery<any[]>(
      prisma.user_Account,
      argument,
    )

    userAccount.forEach((el, idx) => {
      for (const item in el.account_info as Prisma.JsonObject) {
        userAccount[idx].account_info![item] = EncryptDecrypt.decrypt(
          userAccount[idx].account_info![item],
        )
      }
    })
    userAccount as Payment_Method[]

    // {
    //     "payment": {
    //       "id": 2,
    //       "name": "GOPAY",
    //       "type": "Ewallet"
    //     },
    //     "account_info": {
    //       "account_number": "087865774266"
    //     },
    //     "status": "ACTIVE"
    //   }
    return GeneralResponseOutput(true, 200, 'success', userAccount).output()
  }

  public static async updateAccount(
    input: UpdateAccountInput,
    jwt: UserPayload,
  ) {
    const whereUserAccount: ArgumentUserAccount = {
      where: { id: input.id },
    }

    const accountUser =
      await QueryBuilder.findOneByParameterQuery<User_Account>(
        prisma.user_Account,
        whereUserAccount,
      )
    if (!accountUser) {
      return GeneralResponseOutput(
        false,
        404,
        'account user not found',
      ).output()
    }

    if (accountUser.user_id !== jwt.id) {
      return GeneralResponseOutput(
        false,
        400,
        'different user account',
      ).output()
    }

    let updateData: Prisma.User_AccountUncheckedUpdateInput = {}
    let dataAcountInfo: Prisma.InputJsonValue = {}

    // if want change payment method
    if (input.payment_id) {
      // check payment method is available
      const argsCheckPaymentMethod: ArgumentsPaymentMethod = {
        where: { id: input.payment_id },
      }
      const getPaymentMethod =
        await QueryBuilder.findOneByParameterQuery<Payment_Method>(
          prisma.payment_Method,
          argsCheckPaymentMethod,
        )

      // not found payment method
      if (!getPaymentMethod)
        return GeneralResponseOutput(
          false,
          400,
          'Payment method not registered',
        ).output()

      // payment method is inactive
      if (getPaymentMethod.status === 'INACTIVE') {
        return GeneralResponseOutput(
          false,
          400,
          'payment method is inactive',
        ).output()
      }

      if (!input.account_info || Object.keys(input.account_info).length === 0) {
        if (accountUser.payment_id !== input.payment_id) {
          return GeneralResponseOutput(
            false,
            400,
            'account_info must filled if want change payment method',
          ).output()
        }
      }

      if (accountUser.payment_id !== input.payment_id) {
        if (
          getPaymentMethod.type === 'Debit/Credit' &&
          input.account_info?.other
        ) {
          return GeneralResponseOutput(
            false,
            400,
            "property account_info/debit_credit can't be empty",
          ).output()
        } else if (
          getPaymentMethod.type !== 'Debit/Credit' &&
          input.account_info?.debit_credit
        ) { 
          return GeneralResponseOutput(
            false,
            400,
            "property account_info/other can't be empty",
          ).output()
        }
      }
      updateData.payment_id = input.payment_id
    }

    if (input.name) {
      updateData.name = input.name
    }

    if (input.status) {
      updateData.status = input.status
    }

    if (input.account_info) {
      if (input.account_info?.debit_credit) {
        const dataDebitOrCredit: DebitCreditData = {
          ...input.account_info?.debit_credit!,
        }
        try {
          dataDebitOrCredit.cardNumber = EncryptDecrypt.encrypt(
            dataDebitOrCredit.cardNumber,
          )
          dataDebitOrCredit.cvv = EncryptDecrypt.encrypt(dataDebitOrCredit.cvv)
          dataDebitOrCredit.expiryDate = EncryptDecrypt.encrypt(
            dataDebitOrCredit.expiryDate,
          )
          dataDebitOrCredit.holderName = EncryptDecrypt.encrypt(
            dataDebitOrCredit.holderName,
          )
        } catch (error) {
          console.error('ERROR ENCRYPT DEBIT/CREDIT CARD')
          return GeneralResponseOutput(
            false,
            500,
            'Internal server error',
          ).output()
        }
        dataAcountInfo = { ...dataDebitOrCredit }
      } else if (input.account_info?.other) {
        const dataOther: OtherData = { ...input.account_info?.other! }
        try {
          dataOther.account_number = EncryptDecrypt.encrypt(
            dataOther.account_number,
          )
        } catch (error) {
          console.error('ERROR ENCRYPT OTHER DATA')
          return GeneralResponseOutput(
            false,
            500,
            'Internal server error',
          ).output()
        }
        dataAcountInfo = { ...dataOther }
      }

      updateData.account_info = dataAcountInfo
    }

    const argumentUpdateAccount: Prisma.User_AccountUpdateArgs = {
      ...whereUserAccount,
      data: { ...updateData },
    }

    await QueryBuilder.updateQuery<User_Account>(
      prisma.user_Account,
      argumentUpdateAccount,
    )

    return GeneralResponseOutput(true, 200, 'success update account').output()
  }

  public static async deleteAccount(
    input: DeleteAccountInput,
    jwt: UserPayload,
  ) {
    const argumentCheckAccount: ArgumentsPaymentMethod = {
      where: { id: input.account_id },
    }

    const checkAccountUser =
      await QueryBuilder.findOneByParameterQuery<User_Account>(
        prisma.user_Account,
        argumentCheckAccount,
      )

    if (!checkAccountUser) {
      return GeneralResponseOutput(false, 404, 'account not found').output()
    }

    if (checkAccountUser.user_id !== jwt.id) {
      return GeneralResponseOutput(
        false,
        400,
        "can't delete account because not your account",
      ).output()
    }

    const whereDelete: ArgumentUserAccount = {
      where: { id: +input.account_id },
    }
    await QueryBuilder.deleteQuery<User_Account>(
      prisma.user_Account,
      whereDelete,
    )

    return GeneralResponseOutput(true, 200, 'success delete account').output()
  }
}
