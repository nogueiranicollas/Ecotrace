import { Request, Response } from 'express'

import { Service } from './order.service'
import { View } from './order.view'

export class Controller {
  private $service: Service
  private $view: View

  constructor({ $Service = Service, $View = View } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
  }

  public async index(req: Request, res: Response): Promise<Response<any>> {
    const found = await this.$service.find(req)
    // return res.send(this.$view.transformMany(found))
    return res.send(found)
  }

  public async getOrderChartDelayedByMonth(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.getOrderChartDelayedByMonth(req)
    return res.send(found)
  }

  public async getOrderChartBySupplier(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.getOrderChartBySupplier(req)
    return res.send(found)
  }

  public async getOrderChartDeliveredOpenByMonth(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.getOrderChartDeliveredOpenByMonth(req)
    return res.send(found)
  }

  public async getOrderChartByOrigin(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.getOrderChartByOrigin(req)
    return res.send(found)
  }

  public async getOrderCards(
    req: Request,
    res: Response
  ): Promise<Response<any>> {
    const found = await this.$service.getOrderCards(req)
    return res.send(found)
  }
}
