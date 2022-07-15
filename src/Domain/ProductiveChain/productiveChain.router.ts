import { Router as ExpressRouter } from 'express'

import { Controller } from './productiveChain.controller'

import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'

const controller = new Controller()
const router = ExpressRouter()

router
  .get('/', controller.index.bind(controller))

export const Router = router
