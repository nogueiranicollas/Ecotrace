import { Request, Response } from 'express'

import { Service } from './orderHistory.service'
import { View } from './orderHistory.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.fetchAll(req)
    return res.send(this.$view.transformMany(found))
  }
}
