import server from './app'
import dotenv from 'dotenv'
dotenv.config()
async function main() {
    try {
        await server.listen({
          port: +process.env.PORT! ?? 3000,
          host: '0.0.0.0',
        })
        console.log(`Server run in port: ${process.env.PORT}`)
      } catch (error) {
        console.error(error)
        process.exit(1)
      }
}

main()