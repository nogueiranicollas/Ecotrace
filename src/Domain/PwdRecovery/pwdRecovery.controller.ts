import { Request, Response } from 'express'
import { OK } from 'http-status'

import { Service } from './pwdRecovery.service'

export class Controller {
  private $service: Service

  constructor({ $Service = Service } = {}) {
    this.$service = new $Service()
  }

  public async request(req: Request, res: Response): Promise<Response<any>> {
    await this.$service.request(req)
    return res.status(OK).send()
  }

  public async reset(req: Request, res: Response): Promise<Response<any>> {
    await this.$service.reset(req)
    return res.status(OK).send()
  }
}
