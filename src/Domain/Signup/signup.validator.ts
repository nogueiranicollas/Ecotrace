import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export class Validator extends YupValidator {
  public static schemas = {
    default: Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      company: Yup.string().required(),
      source: Yup.string().required(),
      message: Yup.string().required()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
