import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilitySupplier.schemas'

export const Validator = new YupValidator(schemas)
