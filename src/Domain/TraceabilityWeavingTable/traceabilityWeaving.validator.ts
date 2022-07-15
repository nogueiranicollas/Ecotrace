import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilityWeaving.schemas'

export const Validator = new YupValidator(schemas)
