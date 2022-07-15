import { YupValidator } from '@/Shared/Providers'

import { schemas } from './reference.schemas'

export const Validator = new YupValidator(schemas)
