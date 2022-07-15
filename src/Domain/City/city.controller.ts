import { Request, Response } from 'express'

import { City as Service } from './city.service'
import { View } from './city.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async showByUF(req: Request, res: Response): Promise<Response<any>> {
    const { params } = req
    const found = await this.$service.findByUF(params)
    return res.send(this.$view.transformToList(found))
  }
}
