import { Router as ExpressRouter } from 'express'

import { Controller } from './city.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/uf/:uf', controller.showByUF.bind(controller))

export const Router = router
