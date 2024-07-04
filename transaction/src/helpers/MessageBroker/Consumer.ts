import amqp, { Channel, Connection } from 'amqplib/callback_api'
import WalletControllers from '../../modules/wallet/wallet.controllers'
import { RequestCreateWalletRabbitMQ } from '../../modules/wallet/wallet.schema'
import TransactionControllers from '../../modules/transaction/transaction.controllers'

console.log('Connect to rabbitmq listener')
amqp.connect(
  process.env.RABBITMQ_URL!,
  (error0: Error, connection: Connection) => {
    if (error0) throw error0
    connection.createChannel(async function (error1: Error, channel: Channel) {
      if (error1) {
        console.error(error1)
        console.log('ERROR CREATE CHANNEL RABBITMQ')
        throw error1
      }

      channel.assertQueue('create-wallet', {
        durable: true,
      })

      channel.assertQueue('callback-midtrans', {
        durable: true,
      })

      channel.consume(
        'create-wallet',
        async message => {
          const output: RequestCreateWalletRabbitMQ = JSON.parse(
            message!.content.toString(),
          )
          await WalletControllers.createWallet(output)
        },
        {
          noAck: true,
        },
      )

      channel.consume(
        'callback-midtrans',
        async message => {
          const output = JSON.parse(
            message!.content.toString(),
          )
          await TransactionControllers.callbackMidtrans(output)
        },
        {
          noAck: true,
        },
      )
    })
  },
)
