import { YupValidator } from '@/Shared/Providers'

import { schemas } from './productiveChain.schemas'

export const Validator = new YupValidator(schemas)
