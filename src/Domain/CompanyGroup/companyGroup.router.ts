import { Router as ExpressRouter } from 'express'

import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'

import { Controller } from './companyGroup.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get('/accessRelease', controller.accessRelease.bind(controller))
router.get('/options', controller.options.bind(controller))
router.get('/:id', controller.show.bind(controller))

router.post('/', authUserRole, controller.store.bind(controller))

router.patch(
  '/link-with-companies/:id',
  authUserRole,
  controller.linkWithCompanies.bind(controller)
)
router.patch(
  '/unlink-with-companies/:id',
  authUserRole,
  controller.unlinkWithCompanies.bind(controller)
)

router.put('/:id', authUserRole, controller.update.bind(controller))

router.delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
