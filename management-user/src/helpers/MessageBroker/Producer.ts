import amqp, { Connection, Channel } from 'amqplib'

export default function (message: string, queueName: string) {
  console.log('Connecting to RabbitMQ...')
  let ch: any
  amqp
    .connect(process.env.RABBITMQ_URL!)
    .then((conn: Connection) => {
      return conn
        .createChannel()
        .then(async (channel: Channel) => {
          await channel.assertQueue('create-wallet', {
            durable: true,
          })

          await channel.assertQueue('callback-midtrans', {
            durable: true,
          })

          switch (queueName) {
            case 'create-wallet':
              channel.sendToQueue('create-wallet', Buffer.from(message))
              break
            case 'callback-midtrans':
              channel.sendToQueue('callback-midtrans', Buffer.from(message))
              break
            default:
              console.warn('event not found')
          }
          channel.close()
        })
        .finally(() => {
          setTimeout(function () {
            conn.close()
          }, 1500)
        })
    })
    .catch(console.warn)
}
