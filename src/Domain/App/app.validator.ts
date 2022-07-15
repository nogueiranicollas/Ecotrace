import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export class Validator extends YupValidator {
  public static schemas = {
    header: Yup.object().shape({
      app: Yup.string().url().required()
    }),
    default: Yup.object().shape({})
  }

  constructor() {
    super(Validator.schemas)
  }
}
