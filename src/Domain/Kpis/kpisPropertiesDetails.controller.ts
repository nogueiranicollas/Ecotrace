import { Request, Response } from 'express'
import { Service } from './kpisPropertiesDetails.service'
import { View } from './kpisPropertiesDetails.view'

export class ControllerPropertiesDetails {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async details(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findDetails(req)
    return res.send(this.$view.transformMany(found))
  }
}
