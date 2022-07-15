import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'
import { Router as ExpressRouter } from 'express'

import { Controller } from './retail.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/by-group/:groupId', controller.findByGroup.bind(controller))
router.get(
  '/unrelated-with-group/:groupId',
  controller.findUnrelatedWithGroup.bind(controller)
)
router.get('/:id', controller.show.bind(controller))
router.get('/', controller.index.bind(controller))

router.post('/', authUserRole, controller.store.bind(controller))

router.put('/:id', authUserRole, controller.update.bind(controller))

router.delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
