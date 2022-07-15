import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { AuthReq, WithFileReq } from '@/Shared/Protocols'
import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

import { Service } from './user.service'
import { View } from './user.view'
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

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToList(found))
  }

  public async show(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findOne(req)
    return res.send(this.$view.transformOne(found))
  }

  public async filterOptions(
    _req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.findFilterOptions()
    return res.send(this.$view.transformFilterOptions(found))
  }

  public async store(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const created = await this.$service.insertOne(req)
    return res.status(CREATED).send(this.$view.transformOne(created))
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const updated = await this.$service.updateOne(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async updateProfile(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const updated = await this.$service.updateProfile(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async uploadAvatar(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    await this.$service.uploadAvatar(req as WithFileReq)
    return res.status(OK).send()
  }

  public async updatePwd(req: Request, res: Response): Promise<Response<any>> {
    const updated = await this.$service.updatePwd(req as AuthReq)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('users', user)

    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
