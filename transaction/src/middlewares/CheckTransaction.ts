import { FastifyReply, FastifyRequest } from "fastify";
import { RequestTransactionSchema } from "../modules/transaction/transaction.schema";
import prisma from "../helpers/Prisma";
import { GeneralOutput } from "../helpers/GeneralResponse";

export default async function (req: FastifyRequest<{
    Body: RequestTransactionSchema
}>, reply: FastifyReply) {
    const body = req.body

    const checkTransaction = await prisma.transaction.findFirst({
        where: { reff_id: body.reff_id },
        select: {
            id: true
        }
    })
    if(checkTransaction){
        const output: GeneralOutput = {
            success: true, statusCode:400,
            message: `reff_id ${body.reff_id} already use`
        }
        return reply.code(400).send(output)
    }

}