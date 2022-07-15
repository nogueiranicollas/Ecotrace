import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilityTotalizers.schemas'

export const Validator = new YupValidator(schemas)
