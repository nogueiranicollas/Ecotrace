import { YupValidator } from '@/Shared/Providers'

import { schemas } from './property.schemas'

export const Validator = new YupValidator(schemas)
