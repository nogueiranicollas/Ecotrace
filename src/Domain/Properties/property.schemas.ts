import * as Yup from 'yup'

import { schemas as contactSchemas } from '@/Domain/Contact/contact.schemas'
import { schemas as producerSchemas } from '@/Domain/Producer/producer.schemas'

export const schemas = {
  default: Yup.object().shape({
    name: Yup.string().required(),
    fancyName: Yup.string().required(),
    CAR: Yup.string().required(),
    establishmentCode: Yup.string(),
    INCRA: Yup.string(),
    NIRF: Yup.string(),
    CCIR: Yup.string(),
    LARLAU: Yup.string(),
    description: Yup.string(),
    perimeterDocsOrigin: Yup.string().nullable(),
    lat: Yup.lazy((data) => {
      if (data === 0 || data) return Yup.number().required()
      return Yup.string().nullable(true)
    }),
    lng: Yup.lazy((data) => {
      if (data === 0 || data) return Yup.number().required()
      return Yup.string().nullable(true)
    }),
    area: Yup.string(),
    cityId: Yup.string().required(),
    address: Yup.string(),
    biomeId: Yup.string(),
    contacts: Yup.lazy((data) => {
      const hasEntries = Array.isArray(data) && Object.keys(data[0]).length
      if (hasEntries) return Yup.array().of(contactSchemas.default).min(1)
      return Yup.array()
    }),
    certifications: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.string().uuid(),
          name: Yup.string().required(),
          acronym: Yup.string().required(),
          number: Yup.string(),
          cnpjCert: Yup.string(),
          corporateName: Yup.string(),
          issuanceDate: Yup.string().nullable(true),
          expirationDate: Yup.string().nullable(true)
        })
      )
      .nullable(true),
    producers: Yup.array().of(producerSchemas.update).min(1)
  }),

  params: Yup.object().shape({
    id: Yup.string().required()
  }),

  CAR: Yup.object().shape({
    CAR: Yup.string().required()
  }),

  producers: Yup.object().shape({
    producers: Yup.array().of(producerSchemas.update).min(1)
  }),

  lockState: Yup.object().shape({
    producers: Yup.array().of(producerSchemas.lockState).min(1)
  }),

  lockAllState: Yup.object().shape({
    blockStatus: Yup.boolean().required(),
    reason: Yup.string().when('blockStatus', {
      is: true,
      then: Yup.string().required(
        'Reason is mandatory when status blocking is true in new property'
      )
    })
  }),

  query: Yup.object().shape({
    blockStatus: Yup.boolean(),
    CAR: Yup.string(),
    CPFCNPJ: Yup.string(),
    name: Yup.string(),
    producer: Yup.string(),
    state: Yup.string(),
    biomeId: Yup.string()
  }),

  propertyTmp: Yup.object().shape({
    propertiesTmpIds: Yup.array().of(Yup.string().uuid().required()).required()
  })
}
