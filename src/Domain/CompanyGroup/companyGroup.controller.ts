import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'
import { Token } from '../Token/token.entity'

import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

import { Service } from './companyGroup.service'
import { View } from './companyGroup.view'

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
    return res.send(this.$view.transformMany(found))
  }

  public async accessRelease(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.findAccessReleaseOnly(req)
    return res.send(this.$view.transformMany(found))
  }

  public async options(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToOptions(found.items))
  }

  public async show(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findOne(req)
    return res.send(this.$view.transformOne(found))
  }

  public async store(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industriesGroup', user)

    const created = await this.$service.insertOne(req)
    return res.status(CREATED).send(this.$view.transformOne(created))
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industriesGroup', user)

    const updated = await this.$service.updateOne(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async linkWithCompanies(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industriesGroup', user)

    const updated = await this.$service.linkWithCompanies(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async unlinkWithCompanies(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industriesGroup', user)

    const updated = await this.$service.unlinkWithCompanies(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industriesGroup', user)

    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
