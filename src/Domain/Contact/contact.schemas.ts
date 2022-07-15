import * as Yup from 'yup'

const schemas = {
  default: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().email().required(),
    phone: Yup.string().required()
  })
}

export { schemas }
