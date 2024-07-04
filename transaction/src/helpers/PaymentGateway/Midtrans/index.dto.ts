export interface ResponseEwalletMidtrans {
    status_code: string
    status_message: string
    transaction_id: string
    order_id: string
    merchant_id: string
    gross_amount: string
    currency: string
    payment_type: string
    transaction_time: string
    transaction_status: string
    fraud_status: string
    actions: Action[]
    expiry_time: string
}
  
interface Action {
    name: string
    method: string
    url: string
}

export interface ResponseCreditCard {
    token: string
    redirect_url: string
}