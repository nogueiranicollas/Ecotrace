import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'
import { Router as ExpressRouter } from 'express'

import { Controller } from './propertyProducers.controller'

const controller = new Controller()
const router = ExpressRouter()

router
  .get('/', controller.index.bind(controller))
  .get('/:id', controller.showById.bind(controller))
  .get('/property/:propertyId', controller.showByPropertyId.bind(controller))
  .delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
