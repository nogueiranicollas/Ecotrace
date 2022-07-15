import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilityProprierty.schemas'

export const Validator = new YupValidator(schemas)
