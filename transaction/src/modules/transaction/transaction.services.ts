import { UserPayload } from './../../helpers/types.helper';
import { Prisma, STATUS_TRANSACTION, Transaction, Wallet } from "@prisma/client";
import prisma from '../../helpers/Prisma'
import Payment_Channel from "../../helpers/Payment_Channel";
import { DetailAccountSchema, DetailDestinationSchema, OutputMidtrans, RequestHistory, RequestPaymentGateway, RequestTransactionSchema } from "./transaction.schema";
import { QueryBuilder } from '../../helpers/QueryBuilder';
import { GeneralOutput, GeneralResponseOutput } from '../../helpers/GeneralResponse';
import { PaginateFunction, paginator } from '../../helpers/pagination';

type TopUP = {
  reff_id: string
  amount: number
  detail_account: DetailAccountSchema
  wallet?: boolean
}

type Withdraw = {
  reff_id: string
  amount: number
}

type sendMoney = {
  detail_destination: DetailDestinationSchema
} & TopUP

const paginate: PaginateFunction = paginator({});
class TransactionServices {
  public async createTransaction(input: RequestTransactionSchema, jwt: UserPayload) {
    let output: GeneralOutput
    switch(input.action){
      case "TOPUP":
        if(!input.detail_account || (Object.keys(input.detail_account).length === 0)){
          return GeneralResponseOutput(false, 400, 'detail_account must filled').output()
        }
        const reqTopup: TopUP = {
          reff_id: input.reff_id,
          amount: input.amount,
          detail_account: input.detail_account!
        } 
        output = await this.topup(reqTopup, jwt);
        break;
      case "WITHDRAW":
        const reqWithdraw: Withdraw = {
          amount: input.amount,
          reff_id: input.reff_id
        }
        output = await this.withdraw(reqWithdraw, jwt);
        break;
      default:
        if(!input.detail_destination || (Object.keys(input.detail_destination).length === 0)){
          return GeneralResponseOutput(false, 400, 'detail_destination must filled').output()
        }
        const reqSend: sendMoney = {
          reff_id: input.reff_id,
          amount: input.amount,
          wallet: input.wallet,
          detail_account: input.detail_account!,
          detail_destination: input.detail_destination!
        }
        output = await this.send(reqSend, jwt);
        break;
    }
    return output
  }

  public async getHistoryTransaction(payload:RequestHistory, jwt: UserPayload) {
    const where: Prisma.TransactionWhereInput = {
      user_id: jwt.id
    };

    const argumentTransaction: Prisma.TransactionFindManyArgs = {
      orderBy: {id: "desc"},
      select: {
        id: true, reff_id: true, action: true,
        type: true, status: true, amount: true,
        admin: true, total: true, currency: true,
        created_at: true, updated_at: true,
      }
    }

    if(!payload.page) payload.page = 0
    if(!payload.size) payload.size = 10
    if(payload.action) where.action = payload.action
    if(payload.status) where.status = payload.status
    if(payload.reff_id) where.reff_id = payload.reff_id
    argumentTransaction.where = {...where}
    const result = await paginate(
      prisma.transaction,
      {
        ...argumentTransaction
      },
      {
        page: payload.page,
        perPage: payload.size,
      },
    );
    const output: GeneralOutput = {
      success: true, statusCode:200,
      message: "success", data: {...result}
    }

    return output
  }

  private async topup(input: TopUP, jwt: UserPayload) {

    const whereWallet: Prisma.WalletFindFirstArgs = {
      where: { user_id: jwt.id },
      select: {
        id: true
      }
    }

    const getWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
      prisma.wallet, whereWallet
    )

    const saveData: Prisma.TransactionUncheckedCreateInput = {
        action: "TOPUP",
        reff_id: input.reff_id,
        type: "CREDIT",
        user_id: jwt.id,
        admin: 0,
        amount: input.amount,
        total: input.amount,
        currency: "USD",
        status: "PENDING",
        wallet_id: getWallet.id,
        detail_account: input.detail_account
    }

    const createWallet = await QueryBuilder.createQuery<Transaction>(
      prisma.transaction, saveData
    )

    const request: RequestPaymentGateway = {
      amount: input.amount,
      reff_id: input.reff_id,
      name: input.detail_account.name,
      type: input.detail_account.type
    }

    const resultPaymentChannel = await Payment_Channel(request)

    // if failed  generate payment channel
    if(!resultPaymentChannel.success){
      const updateFailed: Prisma.TransactionUpdateArgs = {
        where: { id: createWallet.id },
        data: {
          status: "FAILED"
        }
      }

      await QueryBuilder.updateQuery<Transaction>(
        prisma.transaction, updateFailed
      )
      return resultPaymentChannel
    }

    const updateSuccess: Prisma.TransactionUpdateArgs = {
      where: { id: createWallet.id },
      data: {
        request_midtrans: resultPaymentChannel.data?.request,
        response_midtrans: resultPaymentChannel.data?.response
      }
    }

    await QueryBuilder.updateQuery<Transaction>(
      prisma.transaction, updateSuccess
    )

    delete resultPaymentChannel.data?.request
    delete resultPaymentChannel.data?.response
    return resultPaymentChannel

  }

  private async send(input: sendMoney, jwt: UserPayload) {
    const whereWallet: Prisma.WalletFindFirstArgs = {
      where: { user_id: jwt.id },
      select: {
        id: true,
        amount: true
      }
    }

    const getWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
      prisma.wallet, whereWallet
    )

    const saveData: Prisma.TransactionUncheckedCreateInput = {
        action: "SEND",
        reff_id: input.reff_id,
        type: "DEBIT",
        user_id: jwt.id,
        admin: 0,
        amount: 0,
        total: 0,
        currency: "USD",
        status: "PENDING",
        wallet_id: getWallet.id,
        detail_destination: input.detail_destination
    }

    const createWallet = await QueryBuilder.createQuery<Transaction>(
      prisma.transaction, saveData
    )

    // send money using wallet
    if(input.wallet){
      if(getWallet.amount < input.amount){
        const output: OutputMidtrans = {
          success: false, statusCode: 400,
          message: "insufficient amount", data:null
        }
        return output
      }
      const amountFinal = getWallet.amount - input.amount
      const updateWallet: Prisma.WalletUpdateArgs = {
        where:{ id:  getWallet.id },
        data: {
          amount: amountFinal
        }
      }

      await QueryBuilder.updateQuery<Wallet>(
        prisma.wallet, updateWallet
      )

      const result: OutputMidtrans = {
        success: true, statusCode:200,
        message: "send money success", data: null
      }
      return result
    }

    let amountSend:number
    let adminIncrease: number
    if(input.detail_account.admin_type === "FIX"){
      amountSend = input.amount + input.detail_account.admin
    } else {
      adminIncrease = Math.round(input.amount * input.detail_account.admin)
      amountSend = input.amount + adminIncrease
    }
    const request: RequestPaymentGateway = {
      amount: amountSend,
      reff_id: input.reff_id,
      name: input.detail_account.name,
      type: input.detail_account.type
    }

    const resultPaymentChannel = await Payment_Channel(request)

    // if failed  generate payment channel
    if(!resultPaymentChannel.success){
      const updateFailed: Prisma.TransactionUpdateArgs = {
        where: { id: createWallet.id },
        data: {
          status: "FAILED"
        }
      }

      await QueryBuilder.updateQuery<Transaction>(
        prisma.transaction, updateFailed
      )
      return resultPaymentChannel
    }

    const updateSuccess: Prisma.TransactionUpdateArgs = {
      where: { id: createWallet.id },
      data: {
        amount: input.amount,
        admin: input.detail_account.admin_type === "FIX" ? input.detail_account.admin : adminIncrease!,
        total: amountSend,
        detail_account: input.detail_account,
        request_midtrans: resultPaymentChannel.data?.request,
        response_midtrans: resultPaymentChannel.data?.response
      }
    }

    await QueryBuilder.updateQuery<Transaction>(
      prisma.transaction, updateSuccess
    )

    delete resultPaymentChannel.data?.request
    delete resultPaymentChannel.data?.response
    return resultPaymentChannel
  }

  private async withdraw(input: Withdraw, jwt: UserPayload) {
    const whereWallet: Prisma.WalletFindFirstArgs = {
      where: { user_id: jwt.id },
      select: {
        id: true,
        amount: true
      }
    }

    const getWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
      prisma.wallet, whereWallet
    )

    const saveData: Prisma.TransactionUncheckedCreateInput = {
        action: "WITHDRAW",
        reff_id: input.reff_id,
        type: "DEBIT",
        user_id: jwt.id,
        admin: 0,
        amount: input.amount,
        currency: "USD",
        status: "PENDING",
        wallet_id: getWallet.id
    }

    const createTreansaction = await QueryBuilder.createQuery<Transaction>(
      prisma.transaction, saveData
    )

    const updateTransaction: Prisma.TransactionUpdateArgs = {
      where: { id: createTreansaction.id },
      data: { status: "SUCCESS"}
    }

    // if wallet amount less than amount withdraw 
    if(getWallet.amount < input.amount){
      updateTransaction.data.status = "FAILED"
      await QueryBuilder.updateQuery<Wallet>(
        prisma.wallet, updateTransaction
      )
      const output: OutputMidtrans = {
        success: false, statusCode: 400,
        message: "insufficient amount", data:null
      }
      return output
    }
    const updateAmount= getWallet.amount - input.amount

    await QueryBuilder.updateQuery<Wallet>(
      prisma.transaction, updateTransaction
    )

    const updateWallet: Prisma.WalletUpdateArgs = {
      where: { id: getWallet.id },
      data: { amount: updateAmount }
    }
    await QueryBuilder.updateQuery<Wallet>(
      prisma.wallet, updateWallet
    )
    const output: OutputMidtrans = {
      success: true, statusCode: 200,
      message: "withdraw money from wallet success", data: null
    }

    return output
  }
  
  public async callbackMidtrans(input: any) {
    const successStatus = ['success','settlement','capture']
    const failedStatus = ['failed','expire','expired','refund']
    
    const reff_id = input.order_id

    const whereTransaction: Prisma.TransactionFindFirstArgs = {
      where: { reff_id }
    }

    const checkTransaction = await QueryBuilder.findOneByParameterQuery<Transaction>(
      prisma.transaction, whereTransaction
    )

    if(successStatus.includes(input.transaction_status) && checkTransaction.status === "SUCCESS"){
      return true
    }

    if(failedStatus.includes(input.transaction_status) && checkTransaction.status === "FAILED"){
      return true
    }

    if(!checkTransaction) return false

    let updateTransaction: Prisma.TransactionUpdateArgs = {
      where: {id: checkTransaction.id},
      data:{}
    };
    if(checkTransaction.status === "PENDING"){
      let status: STATUS_TRANSACTION = successStatus.includes(input.transaction_status) ? "SUCCESS" : failedStatus.includes(input.transaction_status) ?  "FAILED" : "PENDING"
      if(status === "PENDING") return false
      updateTransaction.data.status = status
    } else if(checkTransaction.status === "SUCCESS"){
      if(failedStatus.includes(input.transaction_status)){
        updateTransaction.data.status = "REFUND"
      }
    } else {
      return false
    }

    if(checkTransaction.action === "TOPUP"){
      const argsWhereWallet: Prisma.WalletFindUniqueArgs = {
        where: {id: checkTransaction.wallet_id }
      }
      const getWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
        prisma.wallet, argsWhereWallet
      )

      const updateWalletAmount = getWallet.amount + checkTransaction.total
      const argsUpdateWallet: Prisma.WalletUpdateArgs = {
        where: {id: checkTransaction.wallet_id },
        data: { amount: updateWalletAmount}
      }

      await QueryBuilder.updateQuery<Wallet>(
        prisma.wallet, argsUpdateWallet
      )

      await QueryBuilder.updateQuery<Transaction>(
        prisma.transaction, updateTransaction
      )

      return true
    } else {
      if(updateTransaction.data.status === "REFUND"){
        const argsWhereWallet: Prisma.WalletFindUniqueArgs = {
          where: {id: checkTransaction.wallet_id }
        }
        const getWallet = await QueryBuilder.findOneByParameterQuery<Wallet>(
          prisma.wallet, argsWhereWallet
        )
        const finalWallet  = getWallet.amount + checkTransaction.amount
        const argsUpdateWallet: Prisma.WalletUpdateArgs = {
          where: {id: getWallet.id },
          data: { amount: finalWallet }
        }

        await QueryBuilder.updateQuery<Wallet>(
          prisma.wallet, argsUpdateWallet
        )
        return true
      }


      await QueryBuilder.updateQuery<Transaction>(
        prisma.transaction, updateTransaction
      )
      return true
    }
    // Ewallet Pending
    // {"transaction_time":"2024-04-30 16:09:52","transaction_status":"pending","transaction_id":"991040d0-8cd8-417e-8795-1178e5f6b70f","status_message":"midtrans payment notification","status_code":"201","signature_key":"e821f1ee571edd316e075d4340d9857b143cf923db588ba98c1015252868332ded18d831a26a4660a16ccd975aa2a978fd221addd9f163ac6f71aeaa24e1aea5","payment_type":"gopay","order_id":"TRXID004","merchant_id":"G282567700","gross_amount":"31.00","fraud_status":"accept","expiry_time":"2024-04-30 16:24:52","currency":"IDR"}
  
    // Ewallet Success
    // {"transaction_time":"2024-04-30 16:09:52","transaction_status":"settlement","transaction_id":"991040d0-8cd8-417e-8795-1178e5f6b70f","status_message":"midtrans payment notification","status_code":"200","signature_key":"905f12086a153ccb1f854a0c5218dd0d8434a26a8b38550662cbaea8bca2ac67c2cbea1b23ef9f6f419065ef6eac39c84d564b8e4820b5e411faffb475ac4abe","settlement_time":"2024-04-30 16:11:28","payment_type":"gopay","order_id":"TRXID004","merchant_id":"G282567700","gross_amount":"31.00","fraud_status":"accept","expiry_time":"2024-04-30 16:24:52","currency":"IDR"}
  
    // CC/DB Success
    // {"transaction_time":"2024-04-30 16:13:31","transaction_status":"capture","transaction_id":"1149059b-d80b-4dcd-a174-aeaab9863e70","three_ds_version":"2","status_message":"midtrans payment notification","status_code":"200","signature_key":"cd73fb93532c110ff2dd1d042ddee4e4a0b2dfcf25bdb1e10cd54389a6726a2aefe232e0fdb2f4dacb287d6a01c6c12e13979614004e3e250af55c05750212ff","payment_type":"credit_card","order_id":"TRXID005","metadata":{},"merchant_id":"G282567700","masked_card":"48111111-1114","gross_amount":"33.00","fraud_status":"accept","expiry_time":"2024-05-08 16:13:31","eci":"05","currency":"IDR","channel_response_message":"Approved","channel_response_code":"00","card_type":"credit","bank":"cimb","approval_code":"1714468424429"}
  }
}

export default new TransactionServices()
