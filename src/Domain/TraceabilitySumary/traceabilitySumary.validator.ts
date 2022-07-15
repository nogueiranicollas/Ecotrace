import { YupValidator } from '@/Shared/Providers'

import { schemas } from './traceabilitySumary.schemas'

export const Validator = new YupValidator(schemas)
