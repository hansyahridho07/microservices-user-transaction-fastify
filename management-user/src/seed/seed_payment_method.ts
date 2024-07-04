import { Payment_Method, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const data: Payment_Method[] = [
    {
      id: 1,
      name: 'Bank BCA',
      type: 'Debit/Credit',
      provider: 'Xendit',
      status: 'ACTIVE',
      admin_type: 'PERCENTAGE',
      admin: 0.1,
    },
    {
      id: 2,
      name: 'Gopay',
      type: 'Ewallet',
      provider: 'Xendit',
      status: 'ACTIVE',
      admin_type: 'FIX',
      admin: 1,
    },
  ]

  await prisma.payment_Method.createMany({ data: data })
  console.log('Seed payment method is done!')
}
seed()
