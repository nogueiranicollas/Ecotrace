import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilityWiring.schemas'

export const Validator = new YupValidator(schemas)
