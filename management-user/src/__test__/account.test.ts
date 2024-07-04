import tap from 'tap'
import app from '../app'
import { LoginOutput } from 'src/modules/user/user.schemas'

let tokenLogin: string
const idDataPayment = 19 // dinamic id, must update
const accountIdDelete = 20 // dinamic id, must update

// test for testcase: Failed update account because wrong input account_info, from Ewallet to Debit/Credit Card
const idPaymentUserEwallet = 20
tap.beforeEach(async(t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "ridhohansyah815@gmail.com",
            password: "password"
        },
        url: '/api/v1/user/login'
    })
    const token: LoginOutput = JSON.parse(response.body)
    tokenLogin = token.data.access_token
})

tap.afterEach(async (t) => {
    t.teardown(() => {
        app.close()
    })
})

tap.test("Success get payment list", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: '/api/v1/account/payment-list',
        headers: {
            authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 200)
})

// tap.test("Success create new ewallet user payment list", async (t) => {
//     const response = await app.inject({
//         method: "POST",
//         body: {
//             "payment_id": 2,
//             "name": "Muhammad Ridho Hansyah",
//             "account_info": {
//               "other": {
//                 "account_number": "087865774266"
//               }
//             }
//         },
//         url: '/api/v1/account',
//         headers: {
//           authorization: "Bearer " + tokenLogin
//         }
//     })

//     t.equal(response.statusCode, 201)
//     const result = response.json()

//     t.match(result, { success: true, statusCode: 201, message: String, data: null })
// })

tap.test("Success get user account payment list", async t => {
    const response = await app.inject({
        method: "GET",
        url: '/api/v1/account',
        headers: {
          authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 200)
    
    // const result = response.json()

    // t.match(result, {
    //     success: true,
    //     statusCode: 200,
    //     message: String,
    //     data: [
            
    //     ]
    // })
})

tap.test("Success update user account payment list frow ewallet to debit/credit card", async t => {
    const response = await app.inject({
        method: "PUT",
        url: '/api/v1/account',
        headers: {
            authorization: "Bearer " + tokenLogin
        },
        body: {
            id: idDataPayment,
            payment_id: 1,
            name: "Ridho Hansyah",
            account_info: {
                "debit_credit": {
                    "cvv": "123",
                    "cardNumber": "1234123412341234",
                    "expiryDate": "12/29",
                    "holderName": "Muhammad Ridho Hansyah"
                }
            },
            status: "INACTIVE"
        }
    })

    t.equal(response.statusCode, 200)

    const result = response.json()

    t.match(result, {
        "success": true,
        "statusCode": 200,
        "message": "success update account",
        "data": null
      })
})

// tap.test("Success delete user account payment", async t => {
//     const response = await app.inject({
//         method: "DELETE",
//         url: `/api/v1/account?account_id=${accountIdDelete}`,
//         headers: {
//             authorization: "Bearer " + tokenLogin
//         },
        
//     })

//     t.equal(response.statusCode, 200)
//     const result = response.json()
//     t.match(result, {
//         "success": true,
//         "statusCode": 200,
//         "message": "success delete account",
//         "data": null
//       })
// })




// =============== FAILED  TEST ===============
tap.test("Failed create account because not input in account_info", async t => {
        const response = await app.inject({
            method: "POST",
            body: {
                "payment_id": 2,
                "name": "Muhammad Ridho Hansyah",
                "account_info": {}
            },
            url: '/api/v1/account',
            headers: {
            authorization: "Bearer " + tokenLogin
            }
        })

        t.equal(response.statusCode, 400)
        const result = response.json()
        t.match(result, {
            success: false,
            statusCode: 400,
            message: String,
            data: null
        })
})

tap.test("Failed update account because wrong input account_info, from Debit/Credit Card to Ewallet", async t => {
    const response = await app.inject({
        method: "PUT",
        body: {
            id: idDataPayment,
            payment_id: 2,
            name: "Ridho Hansyah",
            account_info: {
                "debit_credit": {
                    "cvv": "123",
                    "cardNumber": "1234123412341234",
                    "expiryDate": "12/29",
                    "holderName": "Muhammad Ridho Hansyah"
                }
            },
            status: "INACTIVE"
        },
        url: '/api/v1/account',
        headers: {
        authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 400)
    const result = response.json()
    t.match(result, {
        success: false,
        statusCode: 400,
        message: String,
        data: null
    })
})

tap.test("Failed update account because wrong input account_info, from Ewallet to Debit/Credit Card", async t => {
    // chose data user ewallet, then change to  debit/credit card, but  in account_info put data other or data for ewallet
    const response = await app.inject({
        method: "PUT",
        body: {
            id: idPaymentUserEwallet,
            payment_id: 1,
            name: "Ridho Hansyah",
            account_info: {
                "other": {
                    "account_number": "087865774266"
                }
            },
            status: "INACTIVE"
        },
        url: '/api/v1/account',
        headers: {
        authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 400)
    const result = response.json()
    t.match(result, {
        success: false,
        statusCode: 400,
        message: String,
        data: null
    })
})

tap.test("Failed create account because wrong payment_id", async t => {
    const response = await app.inject({
        method: "POST",
        body: {
            "payment_id": 10,
            "name": "Muhammad Ridho Hansyah",
            "account_info": {}
        },
        url: '/api/v1/account',
        headers: {
        authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 400)
    const result = response.json()
    t.match(result, {
        success: false,
        statusCode: 400,
        message: String,
        data: null
    })
})

tap.test("Failed create account because wrong payment_id", async t => {
    const response = await app.inject({
        method: "POST",
        body: {
            "name": "Muhammad Ridho Hansyah",
            "account_info": {}
        },
        url: '/api/v1/account',
        headers: {
        authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 400)
    
    const result = response.json()
    t.match(result, {
        statusCode: Number,
        code: String,
        error: String,
        message: String
    })
})

tap.test("Failed update user account because not input id", async t => {
    tap.test("Success update user account payment list frow ewallet to debit/credit card", async t => {
        const response = await app.inject({
            method: "PUT",
            url: '/api/v1/account',
            headers: {
                authorization: "Bearer " + tokenLogin
            },
            body: {
                // id: idDataPayment,
                payment_id: 1,
                name: "Ridho Hansyah",
                account_info: {
                    "debit_credit": {
                        "cvv": "123",
                        "cardNumber": "1234123412341234",
                        "expiryDate": "12/29",
                        "holderName": "Muhammad Ridho Hansyah"
                    }
                },
                status: "INACTIVE"
            }
        })
    
        t.equal(response.statusCode, 400)
    
        const result = response.json()

        t.match(result, {
            statusCode: Number,
            code: String,
            error: String,
            message: String
        })
    })
})

tap.test("Failed create new user payment list, because not input  data inside account_info", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            "payment_id": 2,
            "name": "Muhammad Ridho Hansyah",
            "account_info": {
            }
        },
        url: '/api/v1/account',
        headers: {
          authorization: "Bearer " + tokenLogin
        }
    })

    t.equal(response.statusCode, 400)
    const result = response.json()
    t.match(result, {
        success: false,
        statusCode: 400,
        message: String,
        data: null
    })
})