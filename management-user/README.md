<h1>DOCUMENTATION USER MANAGEMENT</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Fastify.png"/>
</p>

## TECH STACK

<h3 align="left">Languages and Tools:</h3>
<h2 align="left"> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" alt="typescript" width="80" height="80"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="80" height="80"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="80" height="80"/> </a> <a href="https://www.rabbitmq.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg" alt="rabbitMQ" width="80" height="80"/> </a> <a href="https://www.prisma.io" target="_blank" rel="noreferrer"> <img src="https://miro.medium.com/v2/resize:fit:1024/0*VLLYS8MznQJXq-1_.jpg" alt="prismaORM" width="80" height="80"/> </a> <a href="https://www.prisma.io" target="_blank" rel="noreferrer"> <img src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" alt="supabase" width="80" height="80"/> </a> </h2>

## Introduction
This project made by Muhammad Ridho Hansyah

## Project Features
User Management: 
* Users can signup and login
* Users can get detail data user
* Authenticated users using Supabase Auth for every route except login and register
* Users can create account payment for send/topup
* Users can get account payment
* Users can update account
* Users can delete account 

Transaction: 
* User can topup for increase balance
* User can send money with wallet or can chose from account payment
* User can withdraw money from wallet user
* User can see history transaction

## ENV
You can use this env, because this env is same as env in AWS EC2 and credential Supabase. 

<table>
<thead>
  <tr>
    <th>No</th>
    <th>Name</th>
    <th>Value</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>DATABASE_URL</td>
    <td>postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]</td>
    <td>How to create database url: database://username:password@host:port/db_name</td>
  </tr>
  <tr>
    <td>2</td>
    <td>PORT</td>
    <td>4000</td>
    <td>Module run in port</td>
  </tr>
  <tr>
    <td>3</td>
    <td>URL_SERVICE_TRANSACTION</td>
    <td>http://localhost:4001</td>
    <td>Url for transaction send/withdraw/topup</td>
  </tr>
  <tr>
    <td>4</td>
    <td>SECRET_JWT</td>
    <td>secretjwt</td>
    <td>Secret for decrypt jsonwebtoken, get from supabase</td>
  </tr>
  <tr>
    <td>5</td>
    <td>SUPABASE_URL</td>
    <td>https://supabase.com</td>
    <td>URL for service supabase</td>
  </tr>
  <tr>
    <td>6</td>
    <td>SUPABASE_KEY</td>
    <td>supabase_key</td>
    <td>Key supabase</td>
  </tr>
  <tr>
    <td>7</td>
    <td>RABBITMQ_URL</td>
    <td>amqp://[username]:[password]@[HOST]:[PORT]</td>
    <td>url for service rabbitmq in</td>
  </tr>
  <tr>
    <td>8</td>
    <td>CRYPTO_KEY</td>
    <td>123456789</td>
    <td>Key for encryption importan data, like card number and account_number</td>
  </tr>
</tbody>
</table>

## Installation Guide
* Clone this repository.
* Go into folder `management-user`
* Run `npm install` to install all dependencies
* Create file `.env` in root folder management-user
* `You must have supabase account`.
* If you chose use database from my supasabase, run script generate model Prisma `npm run build-non-migrate`, but if you want to chose another database, run script for migration `npm run build-migrate`
*  If in terminal show `Server run in port: PORT`, then you can use the service management-user

> [!TIP]
> Using pm2:
> * After run script `npm install`, run script `npm run  generate-model-prisma` for generate model from Prisma
> * Run script `npm i -g pm2` for running service in background
> * Run script `npm run build` for convert typescript file to javascript file in folder `dist`
> * Run script `pm2 start ./dist/app.js --name=management-user` in route folder management-user
> * Service is running at background, for check run script `pm2 ls`

> [!CAUTION]
> Don't forget to run service transaction for using every service in this project

## API Endpoints

| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /documentation | open /documentation at browser for see swagger documentation |
| POST | /api/v1/user/register | To sign up a new user account |
| POST | /api/v1/user/login | To login an existing user account |
| POST | /api/v1/account | Create account payment |
| GET | /api/v1/account/payment-list | List payment registered in this service |
| GET | /api/v1/account | Get payment method list user who already registered |
| PUT | /api/v1/account | Update data payment account |
| DELETE | /api/v1/account | Deleted a registered user account  |
| POST | /api/v1/transaction | Create trnasaction for send/topup/withdraw  |
| GET | /api/v1/account/history | Get history transaction  |
| POST | /api/v1/account/callback | Route for callback payment channel |

## API LIST

### BASE URL: http://localhost:4000

> [!IMPORTANT]
> API DOCUMENTATION SWAGGER: /documentation

### 1. REGISTER
### POST /api/v1/user/register

#### Request:
```json
{
  "name": "Muhammad Ridho Hansyah",
  "email": "email@gmail.com",
  "password": "password"
}
```

#### Response:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "success created user",
  "data": {
    "id": "ac271c34-4529-4a53-bf89-2a58236f916b",
    "name": "Muhammad Ridho Hansyah",
    "email": "email@gmail.com"
  }
}
```


### 2. Login
### POST /api/v1/user/login

#### Request:
```json
{
  "email": "email@gmail.com",
  "password": "password"
}
```

#### Response:
```json
{
  "success": true,
  "message": "success login",
  "statusCode": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": 1714537946
  }
}
```

### 3. Get Info User
### GET /api/v1/user

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": {
    "id": "ac271c34-4529-4a53-bf89-2a58236f916b",
    "email": "email@gmail.com",
    "name": "Muhammad Ridho Hansyah",
    "wallet": {
      "amount": 40
    }
  }
}
```

### 4. Get List Payment Method
### GET /api/v1/account/payment-list

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Bank BCA",
      "type": "Debit/Credit",
      "provider": "Xendit",
      "status": "ACTIVE",
      "admin_type": "PERCENTAGE",
      "admin": 0.1
    },
    {
      "id": 2,
      "name": "Gopay",
      "type": "Ewallet",
      "provider": "Xendit",
      "status": "ACTIVE",
      "admin_type": "FIX",
      "admin": 1
    }
  ]
}
```

### 5. Create Account User
### POST /api/v1/account

> [!NOTE]
> In this service  have payment method can use, Ewallet and Debit/Credit card. At below have 2 different request for Ewallet and Debit/Credit card you can check

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Request IF USING EWALLET:
```json
{
  "payment_id": 2, // you can get id from API number 4
  "name": "Muhammad Ridho Hansyah", // holder name
  "account_info": {
    "other": {
      "account_number": "08123456789"
    } // if chose payment channel Ewallet, use property account_info/other 
  }
}
```

#### Request IF USING Debit/Credit Card:
```json
{
  "payment_id": 2, // you can get id from API number 4
  "name": "Muhammad Ridho Hansyah", // holder name
  "account_info": {
    "debit_credit": {
    "cvv": "123",
    "cardNumber": "1234123412341234",
    "expiryDate": "12/29",
    "holderName": "Muhammad Ridho Hansyah"
    } // if chose payment channel Ewallet, use property account_info/debit_credit 
  }
}
```

#### Response:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "success create account Gopay",
  "data": null
}
```

### 6. Get List Account Payment registered
### GET /api/v1/account

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

> [!NOTE]
> Account you can use is status `ACTIVE` 

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": [
    {
      "id": 5,
      "payment": {
        "id": 1,
        "name": "Bank BCA",
        "type": "Debit/Credit"
      },
      "account_info": {
        "cvv": "123",
        "cardNumber": "1234123412341234",
        "expiryDate": "12/25",
        "holderName": "Muhammad Ridho Hansyah"
      },
      "status": "ACTIVE"
    },
    {
      "id": 7,
      "payment": {
        "id": 2,
        "name": "Gopay",
        "type": "Ewallet"
      },
      "account_info": {
        "account_number": "087865774266"
      },
      "status": "ACTIVE"
    }
  ]
}
```


### 7. Update Account Payment User
### POST /api/v1/account

> [!NOTE]
> In this service  have payment method can use, Ewallet and Debit/Credit card. At below have 2 different request for Ewallet and Debit/Credit card you can check

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Request:
```json
{
  "id": 2, // id  you get from API number 6 (mandatory)
  "payment_id": 3, // id you get from API number 4 (optional)
  "name": "Muhammad Ridho Hansyah", //  if you want change name owner payment channel (optional)
  "account_info": {
    "other": {
      "account_number": "08123456789"
    }, // if you chose for change to Ewallet, use property  other (optional)
    "debit_credit": {
    "cvv": "123",
    "cardNumber": "1234123412341234",
    "expiryDate": "12/29",
    "holderName": "Muhammad Ridho Hansyah"
    } // if you chose for change to Debit/Credit, use property debit_credit (optional)
  },
  "status": "ACTIVE" // ACTIVE or INACTIVE (optional)
}
```

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success update account",
  "data": null
}
```

### 8. Delete Account Payment User
### DELETE /api/v1/account

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Queryparam
```
?account_id=6
```

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success delete account",
  "data": null
}
```

### 9. Transaction
### POST /api/v1/transaction

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

#### Request:
```json
{
  "reff_id": "20240501006", // unique reff_id for every transaction (mandatory)
  "action": "WITHDRAW", // TOPUP, SEND, WIDHRAW (mandatory)
  "wallet": true, // if transaction want use wallet, if not use  wallet put false (mandatory)
  "account_id": 7, // user payment account, you can see in API number 6 or  can input null
  "amount": 10, // nominal to be transacted (mandatory)
  "detail_destination":{
    "type": "Ewallet",
    "destination": "087865774266",
    "name_type": "Gopay"
  } // destination amount send (optional) or can put null
}
```

#### Response IF wallet true:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "send money success",
  "data": null
}
```

#### Response IF use payment channel:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "success generate link eweallet",
  "data": {
    "method": "GET",
    "link_payment": "https://simulator.sandbox.midtrans.com/gopay/partner/app/payment-pin?id=d2b43b14-9195-4fa4-8091-5cb0ddba2a8a" // open link  in browser for payment
  }
}
```

### 10. Get History Transaction
### GET /api/v1/transaction/history

#### Headers:
```json
{
  "Authorization": "Bearer "
}
```

### QueryString
```json
{
    "action": "", // SEND, WITHDRAW, TOPUP (optional)
    "page": 0, // default 0 (mandatory)
    "size": 10, // default 10 (mandatory)
    "status": "", // PENDING, SUCCESS, FAILED, REFUND (optional)
    "reff_id": "" // unique reff for every transaction (optional)
}
```

> [!NOTE]
> example in query = ?action=SEND&page=0&size=10&status=SUCCESS&reff_id=TRX001

#### Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": [
    {
  "success": true,
  "statusCode": 200,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "reff_id": "20240501001",
        "action": "TOPUP",
        "type": "CREDIT",
        "status": "PENDING",
        "amount": 30,
        "admin": 0,
        "total": 0,
        "currency": "USD",
        "created_at": "2024-05-01T03:38:27.637Z",
        "updated_at": "2024-05-01T03:38:28.727Z"
      }
    ],
    "meta": {
      "total": 10,
      "lastPage": 1,
      "currentPage": 1,
      "perPage": 10,
      "prev": null,
      "next": null
    }
  }
}
  ]
}
```


### ACCOUNT FOR DEBIT/CREDIT CARD

> [!IMPORTANT]
> Key information users need to know to achieve their goal.
> * CARD NUMBER = 4811 1111 1111 1114
> * EXP DATA = free (12/29)
> * CVV = 123
> * PIN = 112233


<!-- ## NEXT IMPROVEMENT
> [!NOTE]
> This API have many think I can improve:
> 1. Using docker
> 2. Swagger API
> 3. Unit  test -->