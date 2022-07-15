import { authUserRole } from '@/Shared/Middlewares/userRoleAuth.middleware'
import { Router as ExpressRouter } from 'express'

import { Controller } from './userPermission.controller'

const controller = new Controller()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get('/:userId', controller.show.bind(controller))

router.put('/update/:userId', authUserRole, controller.update.bind(controller))

router.post('/', authUserRole, controller.store.bind(controller))

export const Router = router
