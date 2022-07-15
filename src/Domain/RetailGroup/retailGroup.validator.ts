import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export class Validator extends YupValidator {
  public static schemas = {
    linkRetails: Yup.object().shape({
      retailIds: Yup.array()
        .of(
          Yup.string()
            .uuid()
            .required()
        )
        .required()
    }),
    default: Yup.object().shape({
      adminEmail: Yup.string()
        .email()
        .required(),
      adminName: Yup.string().required(),
      name: Yup.string().required(),
      visible: Yup.boolean().required()
    }),
    params: Yup.object().shape({
      id: Yup.string()
        .uuid()
        .required()
    }),
    query: Yup.object()
      .shape({
        name: Yup.string(),
        adminEmail: Yup.string().email()
      })
      .camelCase()
  }

  constructor() {
    super(Validator.schemas)
  }
}
