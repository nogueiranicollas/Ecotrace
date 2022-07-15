import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'
import { Router as ExpressRouter } from 'express'

import { Controller } from './retailGroup.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get('/options', controller.options.bind(controller))
router.get('/:id', controller.show.bind(controller))

router.post('/', authUserRole, controller.store.bind(controller))

router.patch(
  '/link-with-retails/:id',
  authUserRole,
  controller.linkWithRetails.bind(controller)
)
router.patch(
  '/unlink-with-retails/:id',
  authUserRole,
  controller.unlinkWithRetails.bind(controller)
)

router.put('/:id', authUserRole, controller.update.bind(controller))

router.delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
