import { YupValidator } from '@/Shared/Providers'

import { schemas } from './propertyLog.schemas'

export const Validator = new YupValidator(schemas)
