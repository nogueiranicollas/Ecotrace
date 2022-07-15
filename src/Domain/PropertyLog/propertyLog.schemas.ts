import * as Yup from 'yup'

export const schemas = {
  default: Yup.object().shape({
    propertyId: Yup.string().required(),
    producerId: Yup.string().required()
  }),

  query: Yup.object().shape({
    propertyId: Yup.string().required(),
    producerId: Yup.string().required()
  })
}
