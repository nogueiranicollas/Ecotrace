import { Request, Response } from 'express'
import { CREATED } from 'http-status'

import { Service } from './signup.service'
import { View } from './signup.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async handle(req: Request, res: Response) {
    const created = await this.$service.handle(req)
    return res.status(CREATED).send(this.$view.transformOne(created))
  }
}
