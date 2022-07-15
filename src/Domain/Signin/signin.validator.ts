import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export class Validator extends YupValidator {
  public static schemas = {
    default: Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .max(32)
        .required()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
