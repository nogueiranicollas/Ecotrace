import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

const schemas = {
  store: Yup.object().shape({
    email: Yup.string().email().required()
  }),
  update: Yup.object().shape({
    email: Yup.string().email().required(),
    token: Yup.string().required(),
    password: Yup.string().min(6).max(32).required(),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')])
      .required()
  })
}
export const Validator = new YupValidator(schemas)
