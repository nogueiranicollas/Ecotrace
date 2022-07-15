import { YupValidator } from '@/Shared/Providers'

import { schemas } from './propertyProducers.schemas'

export const Validator = new YupValidator(schemas)
