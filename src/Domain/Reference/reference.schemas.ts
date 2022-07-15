import * as Yup from 'yup'
import { cpfcnpj } from '@/Shared/Validators'

export const schemas = {
  default: Yup.object().shape({
    nameProducer: Yup.string().required(),
    nameProperty: Yup.string().required(),
    CPFCNPJ: cpfcnpj.verify().required(),
    establishmentCode: Yup.string(),
    perimeterDocsOrigin: Yup.string().nullable(),
    lat: Yup.lazy((data) => {
      if (data === 0 || data) return Yup.number().required()
      return Yup.string().nullable(true)
    }),
    lng: Yup.lazy((data) => {
      if (data === 0 || data) return Yup.number().required()
      return Yup.string().nullable(true)
    }),
    address: Yup.string(),
    cityName: Yup.string(),
    stateName: Yup.string()
  }),

  params: Yup.object().shape({
    id: Yup.string().required()
  }),

  query: Yup.object().shape({ nameProducer: Yup.string() })
}
