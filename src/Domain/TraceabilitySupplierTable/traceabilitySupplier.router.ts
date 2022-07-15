import { Router as ExpressRouter } from 'express'

import { Controller } from './traceabilitySupplier.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))

export const Router = router
