// import { RequestPaymentGateway } from "../../Payment_Channel";
import {AxiosCustom, RequestCustomAxios} from "../../Axios"
import { ResponseCreditCard, ResponseEwalletMidtrans } from "./index.dto";
import { GeneralResponseOutput, GeneralOutput } from "../../GeneralResponse";
import { RequestPaymentGateway, OutputMidtrans } from "../../../modules/transaction/transaction.schema";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const authToken = Buffer.from(SERVER_KEY+":").toString('base64');

interface ResponseMidransSchema {
    method: string
    link_payment: string
    information: string
    request?: RequestCustomAxios
    response?: any
} 
class MidtransService {
    
    async ewallet(input: RequestPaymentGateway): Promise<OutputMidtrans>{
        const url_ewallet = "https://api.sandbox.midtrans.com/v2/charge"
        let parameter = {
            "payment_type": input.name.toLowerCase(),
            "transaction_details": {
                "gross_amount": input.amount,
                "order_id": input.reff_id,
            },
          };
        const configRequest: RequestCustomAxios = {
            access_token: authToken,
            url: url_ewallet,
            body: {...parameter}
        }

        const response = await AxiosCustom.postRequest<ResponseEwalletMidtrans>(configRequest)
        
        if(response instanceof GeneralResponseOutput){
            const responseFailed = response as GeneralOutput
            const output: OutputMidtrans = {
                success: false, statusCode: 400,
                message: responseFailed.message, data: null
            }
            return output
        }

        const result = response as ResponseEwalletMidtrans

        const dataResponse: ResponseMidransSchema = {
            method: result.actions[1].method,
            link_payment: result.actions[1].url,
            information: "Open link_payment in browser",
            request: {...configRequest},
            response: {...result}
        }

        const output: OutputMidtrans = {
            success: true, message: "success generate link eweallet",
            statusCode: 201, data: dataResponse
        }

        return output
    }

    async debit_credit(input: RequestPaymentGateway): Promise<OutputMidtrans> {
        const url_midtrans_credit_card = 'https://app.sandbox.midtrans.com/snap/v1/transactions'
        const body = {
            "transaction_details": {
              "gross_amount": input.amount,
              "order_id": input.reff_id,
            },
            "credit_card":{
              "secure" : true
            }
        }
        
        const configRequest: RequestCustomAxios = {
            access_token: authToken,
            url: url_midtrans_credit_card,
            body: {...body}
        }

        const response = await  AxiosCustom.postRequest<ResponseCreditCard>(configRequest)

        if(response instanceof GeneralResponseOutput){
            const responseFailed = response as GeneralOutput
            const output: OutputMidtrans = {
                success: false, statusCode: 400,
                message: responseFailed.message, data: null
            }
            return output
        }

        const result = response as ResponseCreditCard

        const dataResponse: ResponseMidransSchema = {
            method: "GET",
            link_payment:  result.redirect_url,
            information: "Open link_payment in browser",
            request: {...configRequest},
            response: {...result}
        }

        const output: OutputMidtrans = {
            success: true, message: "success generate link eweallet",
            statusCode: 201, data: dataResponse
        }
        return output
    }
}

export default new MidtransService()