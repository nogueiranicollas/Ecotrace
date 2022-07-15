import { YupValidator } from '@/Shared/Providers'

import { schemas } from './producer.schemas'

export const Validator = new YupValidator(schemas)
