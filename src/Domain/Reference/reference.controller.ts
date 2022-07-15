import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { Reference as Service } from './reference.service'
import { View } from './reference.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToList(found))
  }

  public async showById(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findById(req)
    return res.send(this.$view.transformOne(found))
  }

  public async showByCPFCNPJ(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.findByCPFCNPJ(req)
    return res.send(this.$view.transformOne(found))
  }

  public async store(req: Request, res: Response): Promise<Response<any>> {
    const created = await this.$service.insertOne(req)
    return res.status(CREATED).send(this.$view.transformOne(created))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
