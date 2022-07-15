import { Router as ExpressRouter } from 'express'

import { Controller } from './order.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get(
  '/chart-delayed',
  controller.getOrderChartDelayedByMonth.bind(controller)
)
router.get(
  '/chart-supplier',
  controller.getOrderChartBySupplier.bind(controller)
)
router.get(
  '/chart-delivered-open',
  controller.getOrderChartDeliveredOpenByMonth.bind(controller)
)
router.get('/chart-origin', controller.getOrderChartByOrigin.bind(controller))
router.get('/order-cards', controller.getOrderCards.bind(controller))

export const Router = router
