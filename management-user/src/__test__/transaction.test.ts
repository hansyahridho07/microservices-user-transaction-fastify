import tap from 'tap'
import app from '../app'
import { LoginOutput } from 'src/modules/user/user.schemas'

let tokenLogin: string
const rightEmail = "ridhohansyah815@gmail.com"
const rightPassword = "password"
tap.beforeEach(async(t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: rightEmail,
            password: rightPassword
        },
        url: '/api/v1/user/login'
    })
    const token: LoginOutput = JSON.parse(response.body)
    tokenLogin = token.data.access_token
})

tap.test("Success create transaction TOPUP", async t => {
    const response = await app.inject({
        url: "/api/v1/transaction",
        method: "POST",
        headers: {
            authorization: "Bearer " + tokenLogin
        },
        body: {
            action: "TOPUP",
            wallet: true,
            account_id: 20,
            amount: 10,
            reff_id: String(new Date().getTime())
        }
    })

    t.equal(response.statusCode, 201)
    const result = response.json()
    t.match(result, {
        success:true,
        statusCode: 201,
        message:  String,
        data: {
            method: "GET",
            link_payment: String,
            information: String
        }
    })
})

tap.test("Success create transaction SEND", async t => {
    const response = await app.inject({
        url: "/api/v1/transaction",
        method: "POST",
        headers: {
            authorization: "Bearer " + tokenLogin
        },
        body: {
            action: "SEND",
            wallet: false,
            account_id: 20,
            amount: 10,
            reff_id: String(new Date().getTime()),
            detail_destination: {
                destination : "087865774266",
                type: "Ewallet",
                name_type: "Ridho"
            }
        }
    })

    t.equal(response.statusCode, 201)
    const result = response.json()
    t.match(result, {
        success:true,
        statusCode: 201,
        message:  String,
        data: {
            method: "GET",
            link_payment: String,
            information: String
        }
    })
})

tap.test("Success create transaction WITHDRAW", async t => {
    const response = await app.inject({
        url: "/api/v1/transaction",
        method: "POST",
        headers: {
            authorization: "Bearer " + tokenLogin
        },
        body: {
            action: "WITHDRAW",
            wallet: true,
            account_id: null,
            amount: 10,
            reff_id: String(new Date().getTime())
        }
    })

    t.equal(response.statusCode, 200)
    const result = response.json()
    t.match(result, {
        success:true,
        statusCode: 200,
        message:  String,
        data: null
    })
})

tap.test("Success get history transaction", async t => {
    const response = await app.inject({
        url: "/api/v1/transaction/history",
        method: "GET",
        headers: {
            authorization: "Bearer " + tokenLogin
        },
        query: {
            action: "SEND",
            page: "0",
            size: "10",
            status: "PENDING" //PENDING, SUCCESS, FAILED, REFUND
        },
    })

    t.equal(response.statusCode, 200)
    const result = response.json()
    t.match(result, {
        success:true,
        statusCode: 200,
        message:  String,
        data: {
            data: [],
            "meta": {
                "total": Number,
                "lastPage": Number,
                "currentPage": Number,
                "perPage": Number,
                "prev": null,
                "next": null
            }
        }
    })
})