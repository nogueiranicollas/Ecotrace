import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilityOrder.schemas'

export const Validator = new YupValidator(schemas)
