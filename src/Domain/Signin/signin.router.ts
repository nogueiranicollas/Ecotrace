import { Router as ExpressRouter } from 'express'

import { Controller } from './signin.controller'

const controller = new Controller()
const router = ExpressRouter()

router.post('/', controller.handle.bind(controller))

export const Router = router
