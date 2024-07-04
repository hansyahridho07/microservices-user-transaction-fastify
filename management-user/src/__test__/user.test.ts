import tap from 'tap'
import app from '../app'
import { LoginOutput } from 'src/modules/user/user.schemas'

let tokenLogin: string
const emailToRegist = "hansyahridho815@gmail.com"
const nameToRegist = "Ridho"
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

// tap.afterEach(async (t) => {
//     t.teardown(() => {
//         app.close()
//     })
// })

// tap.test("Success register user should send back 201", async (t) => {
//     const response = await app.inject({
//         method: "POST",
//         body: {
//             name: nameToRegist,
//             email: emailToRegist,
//             password: "password"
//         },
//         url: '/api/v1/user/register'
//     })

//     t.equal(response.statusCode, 201, 'returns a status code of 200')
    
//     const result = response.json()
//     t.match(result, {
//         success: true,
//         statusCode: 201,
//         message: "success created user, please check your email for confirmation",
//         data: {
//             id: String,
//             name: nameToRegist,
//             email: emailToRegist
//         }
//     })
// })

tap.test("Success login user should send back 200", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "ridhohansyah815@gmail.com",
            password: "password"
        },
        url: '/api/v1/user/login'
    })
    t.pass('this passes')
    t.equal(response.statusCode, 200, 'returns a status code of 200')
    t.match(JSON.parse(response.body), 
    {success: Boolean, statusCode: Number, message: String,
        data: {
            access_token: String,
            token_type: String,
            expires_in: Number,
            expires_at: Number
        }
    })
    t.matchOnly(JSON.parse(response.body), {success: true, statusCode: 200, message: "success login",
        data: {
            access_token: String,
            token_type: 'bearer',
            expires_in: 3600,
            expires_at: Number
        }
    })
})

tap.test("Failed login empty email", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "",
            password: "password"
        },
        url: '/api/v1/user/login'
    })
    t.equal(response.statusCode, 400, "expected error code")
    t.match(JSON.parse(response.body), { statusCode: Number, code: String, error: String, message: String}, "expected response error")
})

tap.test("Failed login empty password", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "ridhohansyah815@gmail.com",
            password: ""
        },
        url: '/api/v1/user/login'
    })
    t.equal(response.statusCode, 400, "expected error code")
    t.match(JSON.parse(response.body), { statusCode: Number, code: String, error: String, message: String}, "expected response error")
})

tap.test("Failed login because wrong email", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "ridhohansyah816@gmail.com",
            password: "password"
        },
        url: '/api/v1/user/login'
    })
    t.equal(response.statusCode, 404, "expected error wrong password")
    t.match(JSON.parse(response.body), { success: false, statusCode: 404, message: String, data: null}, "expected response error")
})

tap.test("Failed login because wrong password", async (t) => {
    const response = await app.inject({
        method: "POST",
        body: {
            email: "ridhohansyah815@gmail.com",
            password: "password1"
        },
        url: '/api/v1/user/login'
    })
    t.equal(response.statusCode, 400, "expected error email nor found")
    t.match(JSON.parse(response.body), { success: false, statusCode: 400, message: String, data: null}, "expected response error")
})

tap.test("Get data user", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: '/api/v1/user',
        headers: {
            authorization: "Bearer " + tokenLogin
        }
    })
    t.equal(response.statusCode, 200, "expected success respone")
    t.match(JSON.parse(response.body), {
        success: true,
        statusCode: 200,
        message: String,
        data: {
            id: String,
            email: String,
            name: String,
            wallet: {
                amount: Number
            }
        }
    }, "success response expected")
})