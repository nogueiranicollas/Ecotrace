---
to: src/Domain/<%= Name %>/<%= name %>.validator.ts
unless_exists: true
---
import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

const schemas = {
  default: Yup.object().shape({})
  // store: Yup.object().shape({}),
  // update: Yup.object().shape({})
}
export const Validator = new YupValidator(schemas)
