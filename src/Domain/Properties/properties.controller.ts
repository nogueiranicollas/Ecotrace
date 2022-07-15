import { Request, Response } from 'express'

import { Service } from './properties.service'
import { View } from './properties.view'
import { View as ViewProperty } from './property.view'

import { CREATED, OK } from 'http-status'
import { AuthReq } from '@/Shared/Protocols'
import { Token } from '../Token/token.entity'
import { CheckPermissions } from '@/Shared/Utils/permissions.utils'

export class Controller {
  private $service: Service
  private $view: View
  private $viewProperty: ViewProperty
  $checkPermissions: CheckPermissions

  constructor({
    $Service = Service,
    $View = View,
    $ViewProperty = ViewProperty,
    $CheckPermissions = CheckPermissions
  } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
    this.$viewProperty = new $ViewProperty()
    this.$checkPermissions = new $CheckPermissions()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req, false)
    return res.send(this.$view.transformMany(found))
  }

  public async list(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.list(req)
    return res.send(this.$viewProperty.transformToList(found))
  }

  public async showById(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findById(req)
    return res.send(this.$viewProperty.transformOne(found))
  }

  public async showByCAR(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findByCAR(req)
    return res.send(this.$viewProperty.transformOne(found))
  }

  public async store(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const created = await this.$service.insertOne(req as AuthReq)
    return res.status(CREATED).send(this.$viewProperty.transformOne(created))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }

  public async import(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const importProperties = await this.$service.import(req as AuthReq)
    return res.status(CREATED).send(importProperties)
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const updated = await this.$service.updateOne(req as AuthReq)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async addProducer(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const addProducer = await this.$service.addProducer(req as AuthReq)
    return res.status(OK).send(this.$view.transformOne(addProducer))
  }

  public async changingLockState(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const changingLock = await this.$service.changingLockState(req as AuthReq)
    return res.status(OK).send(this.$view.transformOne(changingLock))
  }

  public async changingLockAllState(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const { user } = req as Request & { user: Token }
    await this.$checkPermissions.permission('propertyRegister', user)

    const changingLockAll = await this.$service.changingLockAllState(
      req as AuthReq
    )
    return res.status(OK).send(this.$view.transformOne(changingLockAll))
  }

  public async getPropetiesLocation(
    req: Request,
    res: Response
  ): Promise<void> {
    const found = await this.$service.find(req, true)
    res.send(
      found.map((each) => ({
        location: {
          longitude: each.longitude,
          latitude: each.latitude
        },
        locationId: each.city_id
      }))
    )
  }
}
