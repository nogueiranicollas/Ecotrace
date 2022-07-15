import { Router as ExpressRouter } from 'express'

import { Controller } from './traceabilityOrder.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get('/details', controller.details.bind(controller))

export const Router = router
