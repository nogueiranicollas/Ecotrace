import { HTTP } from '@/Shared/Providers'
import { Req } from '@/Shared/Protocols'

export class Service extends HTTP {
  private endpoint = '/query/readAssetHistory'
  private assetType = 'handling'

  public async fetchAll(req: Req): Promise<Record<string, any>> {
    const response = await this.post({
      endpoint: this.endpoint,
      payload: {
        key: {
          '@assetType': this.assetType,
          hash_partner: req.query.hashPartner
        }
      }
    })

    return response
  }
}
