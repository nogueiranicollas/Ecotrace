import { Request, Response } from 'express'

import { Service } from './traceability.service'

export class Controller {
  private $service: Service

  constructor({ $Service = Service } = {}) {
    this.$service = new $Service()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    console.log('foundcontroler', found)
    return res.send(found)
  }
}
