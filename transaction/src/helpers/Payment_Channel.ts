import { OutputMidtrans } from './../modules/transaction/transaction.schema';
import MidtransService from './PaymentGateway/Midtrans/Midtrans.service';
import { RequestPaymentGateway } from '../modules/transaction/transaction.schema';
export default async function (input: RequestPaymentGateway) {
    let output: OutputMidtrans;
    switch(input.type){
        case "Ewallet":
            output = await MidtransService.ewallet(input)
            break;
        default:
            output = await MidtransService.debit_credit(input)
            break;
    }

    return output
}