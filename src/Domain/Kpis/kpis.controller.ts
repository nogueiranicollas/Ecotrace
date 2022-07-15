import { Request, Response } from 'express'
import { Service } from './kpis.service'

export class Controller {
  private $service: Service

  constructor({ $Service = Service } = {}) {
    this.$service = new $Service()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req, false)
    return res.send(found)
  }

  public async getPropertiesLocation(
    req: Request,
    res: Response
  ): Promise<void> {
    const found = await this.$service.find(req, true)
    res.send(
      found.map((each) => ({
        location: {
          longitude: each.longitude,
          latitude: each.latitude
        },
        locationId: each.city_id
      }))
    )
  }
}
