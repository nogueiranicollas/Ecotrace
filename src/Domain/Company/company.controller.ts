import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { AuthReq, WithFileReq } from '@/Shared/Protocols'
import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

import { Service } from './company.service'
import { View } from './company.view'
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

  public async create(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const created = await this.$service.createOne(req)
    return res.status(CREATED).send(created)
  }

  public async find(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToList(found))
  }

  public async findByGroup(req: Request, res: Response) {
    const found = await this.$service.findByGroup(req)
    return res.send(found)
  }

  public async findUnrelatedWithGroup(req: Request, res: Response) {
    const found = await this.$service.findUnrelatedWithGroup(req)
    return res.send(found)
  }

  public async findOne(req: Request, res: Response) {
    const found = await this.$service.findOne(req)
    return res.send(this.$view.transformOne(found))
  }

  public async uploadEmployeePhoto(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const updated = await this.$service.uploadEmployeePhoto(req as WithFileReq)
    return res.send(updated)
  }

  public async uploadCompanyPhoto(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const updated = await this.$service.uploadCompanyPhoto(req as WithFileReq)
    return res.send(updated)
  }

  public async removeCompanyPhoto(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const remove = await this.$service.removeCompanyPhoto(req as AuthReq)
    return res.send(remove)
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const updated = await this.$service.updateOne(req)
    return res.status(OK).send(updated)
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }

  public async destroyMany(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('industries', user)

    await this.$service.removeMany(req)
    return res.status(OK).send()
  }
}
