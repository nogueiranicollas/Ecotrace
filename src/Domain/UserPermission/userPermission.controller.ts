import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

import { Service } from './userPermission.service'
import { View } from './userPermission.view'
import { Token } from '../Token/token.entity'

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

  public async show(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findOne(req)
    return res.send({ Permissões: this.$view.transformOne(found) })
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send({ Permissões: this.$view.transformMany(found) })
  }

  public async store(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const created = await this.$service.insertOne(req)
    return res.status(CREATED).send(created)
  }

  public async storeWhenCreateUser(
    req: Request,
    res: Response
  ): Promise<void | Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const created = await this.$service.insertinCreateUser(req)
    return res.status(CREATED).send(created)
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const updated = await this.$service.update(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }
}
