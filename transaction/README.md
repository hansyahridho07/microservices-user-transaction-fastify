<h1>DOCUMENTATION TRANSACTION</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Fastify.png"/>
</p>

## TECH STACK

<h3 align="left">Languages and Tools:</h3>
<h2 align="left"> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/2048px-Typescript_logo_2020.svg.png" alt="typescript" width="80" height="80"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="80" height="80"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="80" height="80"/> </a> <a href="https://www.rabbitmq.com" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg" alt="rabbitMQ" width="80" height="80"/> </a> <a href="https://www.prisma.io" target="_blank" rel="noreferrer"> <img src="https://miro.medium.com/v2/resize:fit:1024/0*VLLYS8MznQJXq-1_.jpg" alt="prismaORM" width="80" height="80"/> </a> <a href="https://www.prisma.io" target="_blank" rel="noreferrer"> <img src="https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png" alt="supabase" width="80" height="80"/> </a>
<a href="https://midtrans.com/en" target="_blank" rel="noreferrer"> <img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Midtrans.png" alt="midtrans" width="80" height="80"/> </a> </h2>

## Introduction
This project made by Muhammad Ridho Hansyah.

## Project Features
Wallet:
* Get data wallet

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
    <td>4001</td>
    <td>Module run in port</td>
  </tr>
  <tr>
    <td>3</td>
    <td>SECRET_JWT</td>
    <td>secretjwt</td>
    <td>Secret for decrypt jsonwebtoken, get from supabase (same like repositry management-user)</td>
  </tr>
  <tr>
    <td>4</td>
    <td>MIDTRANS_SERVER_KEY</td>
    <td>server_key</td>
    <td>Credential for access API Midtrans (you must create account midtrans first)</td>
  </tr>
  <tr>
    <td>5</td>
    <td>RABBITMQ_URL</td>
    <td>amqp://[USERNAME]:[PASSWORD]@[HOST]:[PORT]</td>
    <td>url for service rabbitmq</td>
  </tr>
  <tr>
    <td>6</td>
    <td>CRYPTO_KEY</td>
    <td>12345678</td>
    <td>Key for encryption importan data, like card number and account_number</td>
  </tr>
</tbody>
</table>

## Installation Guide
* Clone this repository.
* Go into folder `transaction`
* Run `npm install` to install all dependencies
* Create file `.env` in root folder management-user
* `You must have Supabase account and Midtrans account`.
* If you chose use database from my supasabase, run script generate model Prisma `npm run build-non-migrate`, but if you want to chose another database, run script for migration `npm run build-migrate`
*  If in terminal show `Server run in port: PORT`, then you can use the service management-user

> [!TIP]
> Using pm2:
> * After run script `npm install`, run script `npm run  generate-model-prisma` for generate model from Prisma
> * Run script `npm i -g pm2` for running service in background
> * Run script `npm run build` for convert typescript file to javascript file in folder `dist`
> * Run script `pm2 start ./dist/server.js --name=transaction` in route folder transaction
> * Service is running at background, for check run script `pm2 ls`

> [!CAUTION]
> Don't forget to run service management-user for using every service in this project

## API Endpoints

> [!IMPORTANT]
> API DOCUMENTATION SWAGGER: /documentation

| HTTP Verbs | Endpoints | Action |
| --- | --- | --- |
| GET | /documentation | open /documentation at browser for see swagger documentation |
| POST | /api/v1/transaction | Create trnasaction for send/topup/withdraw  |
| GET | /api/v1/account/history | Get history transaction  |
| GET | /api/v1/wallet | Get data wallet |


## NOTE
> [!IMPORTANT]
> For API Transaction I don't create API list because this service is already integreted with service management user.
