import axios, { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { GeneralOutput, GeneralResponseOutput } from './GeneralResponse'
class AxiosCustomRequest {

  public async postRequest<T>(
    payload: RequestCustomAxios,
  ) {
    const { body, access_token, url } = payload

    const config: AxiosRequestConfig = {
      url: url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + access_token,
      },
      data: { ...body },
    }

    try {
      const result = await axios<T>(config)
      return result.data
    } catch (error: any) {
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message || error.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          error.message || 'Internal server error',
        ).output()
      }
    }
  }
}

export const AxiosCustom = new AxiosCustomRequest()

export const requestCore = z.object({
  url: z.string(),
  body: z.any(),
  access_token: z.string(),
})

export type RequestCustomAxios = z.infer<typeof requestCore>
