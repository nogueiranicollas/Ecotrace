import { Router as ExpressRouter } from 'express'

import { Controller } from './properties.controller'

import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'

const controller = new Controller()
const router = ExpressRouter()

router
  .get('/', controller.index.bind(controller))
  .get('/locations', controller.getPropetiesLocation.bind(controller))
  .get('/list', controller.list.bind(controller))
  // b2b 322
  .get('/:id', controller.showById.bind(controller))
  .get('/CAR/:CAR', controller.showByCAR.bind(controller))

  .post('/', authUserRole, controller.store.bind(controller))
  .post('/import', authUserRole, controller.import.bind(controller))
  .put('/:id', authUserRole, controller.update.bind(controller))
  .put(
    '/addProducer/:id',
    authUserRole,
    controller.addProducer.bind(controller)
  )
  .put(
    '/changingLockState/:id',
    authUserRole,
    controller.changingLockState.bind(controller)
  )
  .put(
    '/changingLockAllState/:id',
    authUserRole,
    controller.changingLockAllState.bind(controller)
  )
  .delete('/:id', controller.destroy.bind(controller))

export const Router = router
