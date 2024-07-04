import axios, { AxiosRequestConfig } from 'axios'
import { z } from 'zod'
import { GeneralOutput, GeneralResponseOutput } from './GeneralResponse'
class AxiosCustomRequest {
  async getRequest(payload: RequestCustomAxios) {
    const { querystring, access_token, path, url } = payload

    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: access_token,
      },
    }

    if (querystring) config.params = { ...querystring }

    try {
      const result = await axios(config)
      return result.data
    } catch (error: any) {
      console.error('=====ERROR IN AXIOS=====')
      if (error.response) {
        console.error(error.response)
        return GeneralResponseOutput(
          false,
          error.response.status,
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }

  async postRequest<T>(
    payload: RequestCustomAxios,
  ): Promise<T | GeneralOutput> {
    const { body, access_token, path, url } = payload

    const config: AxiosRequestConfig = {
      url: url + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
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
          error.response.data.message,
        ).output()
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(error.request)
        return GeneralResponseOutput(
          false,
          500,
          'Internal server error',
        ).output()
      }
    }
  }
}

export const AxiosCustom = new AxiosCustomRequest()

const requestCore = z.object({
  url: z.string(),
  path: z.string(),
  querystring: z.any().optional(),
  body: z.any().optional(),
  access_token: z.string(),
})

export type RequestCustomAxios = z.infer<typeof requestCore>
