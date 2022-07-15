import { Router as ExpressRouter } from 'express'

import { Uploader } from '@/Shared/Providers'
import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'

import { Controller } from './company.controller'

const controller = new Controller()
const uploader = new Uploader()
const router = ExpressRouter()

router.get('/by-group/:groupId', controller.findByGroup.bind(controller))
router.get(
  '/unrelated-with-group/:groupId',
  controller.findUnrelatedWithGroup.bind(controller)
)
router.get('/:id', controller.findOne.bind(controller))
router.get('/', controller.find.bind(controller))

router.post('/', authUserRole, controller.create.bind(controller))

router.post(
  '/upload-employee-photo/:id/:role',
  authUserRole,
  uploader.engine.single('file'),
  controller.uploadEmployeePhoto.bind(controller)
)
router.post(
  '/upload-company-photo/:id',
  authUserRole,
  uploader.engine.single('file'),
  controller.uploadCompanyPhoto.bind(controller)
)
router.delete(
  '/remove-company-photo/:photoId/:companyId',
  authUserRole,
  controller.removeCompanyPhoto.bind(controller)
)

router.put('/:id', authUserRole, controller.update.bind(controller))

router.delete('/many', authUserRole, controller.destroyMany.bind(controller))
router.delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
