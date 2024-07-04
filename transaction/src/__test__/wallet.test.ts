import tap from 'tap'
import app from '../app'

const tokenLogin = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImtuVHNudEZlbmJEcTZieGkiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE0OTIzMzM4LCJpYXQiOjE3MTQ5MTk3MzgsImlzcyI6Imh0dHBzOi8vYmlqcHZ5b2xteWJidHd5dHd2Zmwuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFjMjcxYzM0LTQ1MjktNGE1My1iZjg5LTJhNTgyMzZmOTE2YiIsImVtYWlsIjoicmlkaG9oYW5zeWFoODE1QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJyaWRob2hhbnN5YWg4MTVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiTXVoYW1tYWQgUmlkaG8gSGFuc3lhaCIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYWMyNzFjMzQtNDUyOS00YTUzLWJmODktMmE1ODIzNmY5MTZiIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MTQ5MTk3Mzh9XSwic2Vzc2lvbl9pZCI6IjI3YjA0N2JlLTNlODctNGEzNC04YzQ2LTY5MzZlNDdkYjg5ZSIsImlzX2Fub255bW91cyI6ZmFsc2V9.gthSZqh4lOg7C11t0asVWTQFdytE0ozHSwLCQ8vsr-o'

tap.test("Success get data wallet", async t => {
    const response = await app.inject({
        url: '/api/v1/wallet',
        method: "GET",
        headers: {
            authorization: 'Bearer ' + tokenLogin
        },
    })

    t.equal(response.statusCode, 200)
    const result = response.json()
    t.match(result, {
        success: true,
        statusCode: 200,
        message: String,
        data: {
            id: Number,
            user_id: String,
            amount: Number
        }
    })
})

tap.test("Failed get data wallet because wrong token", async t => {
    const response = await app.inject({
        url: '/api/v1/wallet',
        method: "GET",
        headers: {
            authorization: 'Bearer1 ' + tokenLogin
        },
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