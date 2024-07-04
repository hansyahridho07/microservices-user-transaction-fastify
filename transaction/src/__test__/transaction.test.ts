import tap from 'tap'
import app from '../app'

const tokenLogin = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImtuVHNudEZlbmJEcTZieGkiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE0OTI1NzEyLCJpYXQiOjE3MTQ5MjIxMTIsImlzcyI6Imh0dHBzOi8vYmlqcHZ5b2xteWJidHd5dHd2Zmwuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFjMjcxYzM0LTQ1MjktNGE1My1iZjg5LTJhNTgyMzZmOTE2YiIsImVtYWlsIjoicmlkaG9oYW5zeWFoODE1QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJyaWRob2hhbnN5YWg4MTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiTXVoYW1tYWQgUmlkaG8gSGFuc3lhaCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYWMyNzFjMzQtNDUyOS00YTUzLWJmODktMmE1ODIzNmY5MTZiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MTQ5MjIxMTJ9XSwic2Vzc2lvbl9pZCI6Ijg0YzczZjA1LTM3YjQtNGUwMC04Y2JiLTllZjdlMGVjZTFhZiIsImlzX2Fub255bW91cyI6ZmFsc2V9.PNumilLXig8K-DGa1XCuuMBZL1Oka8zT7IzzLjuYZ9o'

tap.test("Create transaction TOPUP", async t => {
    const response = await app.inject({
        url: '/api/v1/transaction',
        method: "POST",
        headers: {
            authorization: 'Bearer ' + tokenLogin
        },
        body: {
            action: "TOPUP",
            reff_id: String(new Date().getTime()),
            amount: 10,
            wallet:  true,
            detail_account: {
                id: 1,
                name: "Gopay",
                type: "Ewallet",
                provider: "Xendit",
                admin_type: "FIX",
                admin: 1,
                account_detail: null
            },
            detail_destination: null
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

tap.test("Create transaction SEND", async t => {
    const response = await app.inject({
        url: '/api/v1/transaction',
        method: "POST",
        headers: {
            authorization: 'Bearer ' + tokenLogin
        },
        body: {
            action: "SEND",
            reff_id: String(new Date().getTime()),
            amount: 10,
            wallet: false,
            detail_account: {
                id: 1,
                name: "Gopay",
                type: "Ewallet",
                provider: "Xendit",
                admin_type: "FIX",
                admin: 1,
                account_detail: null
            },
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

tap.test("Create transaction WITHDRAW", async t => {
    const response = await app.inject({
        url: '/api/v1/transaction',
        method: "POST",
        headers: {
            authorization: 'Bearer ' + tokenLogin
        },
        body: {
            action: "WITHDRAW",
            reff_id: String(new Date().getTime()),
            amount: 10,
            wallet: true,
            detail_account: null,
            detail_destination: null
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