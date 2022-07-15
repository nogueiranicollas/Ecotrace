import { Request, Response } from 'express'

import { Service } from './traceabilityOrder.service'
import { View } from './traceabilityOrder.view'

import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

export class Controller {
  private $service: Service
  private $view: View
  $checkPermissions: CheckPermissions

  constructor({
    $Service = Service,
    $View = View,
    $CheckPermissions = CheckPermissions
  } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
    this.$checkPermissions = new $CheckPermissions()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findOrder(req)
    return res.send(this.$view.transformOne(found))
  }

  public async details(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findDetails(req)
    return res.send(this.$view.transformOne(found))
  }
}
