import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { Service } from './retailGroup.service'
import { View } from './retailGroup.view'

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

  public async options(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    return res.send(this.$view.transformToOptions(found.items))
  }

  public async show(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findOne(req)
    return res.send(this.$view.transformOne(found))
  }

  public async store(req: Request, res: Response): Promise<Response<any>> {
    const created = await this.$service.insertOne(req)
    return res.status(CREATED).send(this.$view.transformOne(created))
  }

  public async update(req: Request, res: Response): Promise<Response<any>> {
    const updated = await this.$service.updateOne(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async linkWithRetails(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const updated = await this.$service.linkWithRetails(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async unlinkWithRetails(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const updated = await this.$service.unlinkWithRetails(req)
    return res.status(OK).send(this.$view.transformOne(updated))
  }

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
