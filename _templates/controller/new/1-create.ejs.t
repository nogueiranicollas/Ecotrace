---
to: src/Domain/<%= Name %>/<%= name %>.controller.ts
unless_exists: true
---
import { Request, Response } from 'express'
import { CREATED, OK } from 'http-status'

import { Service } from './<%= name %>.service'
import { View } from './<%= name %>.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find()
    return res.send(this.$view.transformMany(found))
  }

  public async show(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.findByEmail(req)
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

  public async destroy(req: Request, res: Response): Promise<Response<any>> {
    const id = await this.$service.removeOne(req)
    return res.status(OK).send({ id })
  }
}
