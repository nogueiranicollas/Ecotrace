import { Router as ExpressRouter } from 'express'

import { Controller } from './kpis.controller'
import { ControllerPropertiesDetails } from './kpisPropertiesDetails.controller'

const controller = new Controller()
const controllerPropertiesDetails = new ControllerPropertiesDetails()
const router = ExpressRouter()

router.get('/', controller.index.bind(controller))
router.get(
  '/properties-location',
  controller.getPropertiesLocation.bind(controller)
)

router.get(
  '/details',
  controllerPropertiesDetails.details.bind(controllerPropertiesDetails)
)

export const Router = router
