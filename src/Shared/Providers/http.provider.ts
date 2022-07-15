import axios, { AxiosInstance } from 'axios'
import { pick } from 'lodash'
import { api as config } from '@/Config'

type Response = { success: boolean; status: number; data: Record<string, any> }
type PostParams = { endpoint: string; payload?: Record<string, any> }

interface HTTPProvider {
  post(_settings: PostParams): Promise<Response>
}

export class HTTP implements HTTPProvider {
  private $axios: AxiosInstance

  constructor() {
    this.$axios = axios.create({
      baseURL: config.blockChainHost
    })
  }

  private async handle(req): Promise<Response> {
    try {
      const res = await req
      return { success: true, status: res.status, data: res.data }
    } catch (ex) {
      const { response } = ex as Record<string, any>
      if (!response) {
        return { success: false, status: -1, data: ex as Record<string, any> }
      }

      return { ...pick(response, 'data', 'status'), success: false }
    }
  }

  async post({ endpoint, payload = {} }: PostParams): Promise<Response> {
    const req = this.$axios.post(endpoint, payload)
    return await this.handle(req)
  }
}
