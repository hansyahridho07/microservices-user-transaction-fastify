import { z } from 'zod'

export const GeneralResponse = {
  success: z.boolean({
    required_error: 'property success is required',
    invalid_type_error: "property success can't be empty",
  }),
  statusCode: z.number({
    required_error: 'property statusCode is required',
    invalid_type_error: "property statusCode can't be empty",
  }),
  message: z.string({
    required_error: 'property message is required',
    invalid_type_error: "property message can't be empty",
  }),
  data: z.any(),
}

export const GeneralResponseSchema = z.object({
  ...GeneralResponse,
})

export type GeneralOutput = z.infer<typeof GeneralResponseSchema>

export function GeneralResponseOutput(
  success: boolean,
  statusCode: number,
  message: string,
  data: any = null,
) {
  return {
    ...GeneralResponseSchema.parse({ success, statusCode, message, data }),
    output: function (this: GeneralOutput) {
      return {
        success: this.success,
        statusCode: this.statusCode,
        message: this.message,
        data: this.data,
      }
    },
  }
}

const AuthHeadersSchema = z.object({
  Authorization: z.string(),
})

export type HeadersAuth = z.infer<typeof AuthHeadersSchema>
