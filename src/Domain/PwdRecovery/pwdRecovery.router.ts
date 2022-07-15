import { Router as ExpressRouter } from 'express'

import { Controller } from './pwdRecovery.controller'

const controller = new Controller()
const router = ExpressRouter()

router.post('/', controller.request.bind(controller))
router.patch('/', controller.reset.bind(controller))

export const Router = router
