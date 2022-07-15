import { Router as ExpressRouter } from 'express'

import { Uploader } from '@/Shared/Providers'

import { Controller } from './user.controller'
import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'

const controller = new Controller()
const uploader = new Uploader()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get('/filter-options', controller.filterOptions.bind(controller))
router.get('/:id', controller.show.bind(controller))

router.post('/', authUserRole, controller.store.bind(controller))
router.post(
  '/upload-avatar/:id',
  uploader.engine.single('file'),
  controller.uploadAvatar.bind(controller)
)

router.put('/:id', authUserRole, controller.update.bind(controller))
router.put('/update-profile/:id', controller.updateProfile.bind(controller))
router.patch('/update-passwd', controller.updatePwd.bind(controller))

router.delete('/:id', authUserRole, controller.destroy.bind(controller))

export const Router = router
