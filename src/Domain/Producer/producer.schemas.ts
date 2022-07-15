import * as Yup from 'yup'

import { cpfcnpj } from '@/Shared/Validators'

export const schemas = {
  store: Yup.object().shape({
    name: Yup.string().required(),
    CPFCNPJ: cpfcnpj.verify().required(),
    IE: Yup.string(),
    establishmentCode: Yup.string().nullable(),
    livestockExploitationCode: Yup.string().nullable(),
    blockStatus: Yup.boolean().required(),
    reason: Yup.string().when('blockStatus', {
      is: true,
      then: Yup.string().required(
        'Reason is mandatory when status blocking is true in new property'
      )
    }),
    propertyId: Yup.string().uuid().required()
  }),
  update: Yup.object().shape({
    name: Yup.string().required(),
    CPFCNPJ: cpfcnpj.verify().required(),
    IE: Yup.string(),
    establishmentCode: Yup.string().nullable(),
    livestockExploitationCode: Yup.string().nullable(),
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
    state: Yup.string()
  }),
  params: Yup.object().shape({
    id: Yup.string().uuid()
  }),
  lockState: Yup.object().shape({
    id: Yup.string().uuid(),
    blockStatus: Yup.boolean().required(),
    reason: Yup.string().when('blockStatus', {
      is: true,
      then: Yup.string().required(
        'Reason is mandatory when status blocking is true in new property'
      )
    })
  })
}
