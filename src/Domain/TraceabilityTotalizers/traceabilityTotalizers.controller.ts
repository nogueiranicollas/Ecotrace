import { Request, Response } from 'express'

import { Service } from './traceabilityTotalizers.service'
import { View } from './traceabilityTotalizers.view'

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
    const found = await this.$service.findTotalizers(req)
    return res.send(this.$view.transformOne(found))
  }
}
