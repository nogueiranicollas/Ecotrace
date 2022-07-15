import { Request, Response } from 'express'
import { OK } from 'http-status'
import { Token } from '../Token/token.entity'

import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

import { Service } from './propertyProducers.service'
import { View } from './propertyProducers.view'

export class Controller {
  private $service: Service
  private $view: View
  private $checkPermissions: CheckPermissions

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
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToList(found))
  }

  public async showById(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findById(req)
    return res.send(this.$view.transformOne(found))
  }

  public async showByPropertyId(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.findByPropertyId(req)
    return res.send(this.$view.transformToListNotPagination(found))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
