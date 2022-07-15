import { Request, Response } from 'express'

import { Service } from './traceabilitySumary.service'
import { View } from './traceabilitySumary.view'

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
    const found = await this.$service.findSumary(req)
    return res.send(this.$view.transformOne(found))
  }
}
