import * as Yup from 'yup'

import { AVAILABLE_RETAIL_INSPECTION_TYPES } from '@/Shared/Constants'
import { YupValidator } from '@/Shared/Providers'
import { YupCNPJ } from '@/Shared/Utils'

export class Validator extends YupValidator {
  public static schemas = {
    default: Yup.object().shape({
      fancyName: Yup.string().required(),
      name: Yup.string().required(),
      inspectionType: Yup.lazy((data) => {
        if (data) {
          return Yup.string()
            .oneOf(AVAILABLE_RETAIL_INSPECTION_TYPES)
            .required()
        }
        return Yup.string()
      }),
      inspectionNum: Yup.string(),
      cnpj: YupCNPJ.verify().required(),
      ie: Yup.string().required(),
      status: Yup.boolean().required(),
      qualifications: Yup.array().of(Yup.string().required()).required(),
      address: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      lat: Yup.lazy((data) => {
        if (data === 0 || data) return Yup.number().required()
        return Yup.string().nullable(true)
      }),
      lng: Yup.lazy((data) => {
        if (data === 0 || data) return Yup.number().required()
        return Yup.string().nullable(true)
      }),
      cep: Yup.string().required(),
      contacts: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.string().uuid(),
            name: Yup.string().required(),
            phone: Yup.string().required(),
            email: Yup.string().required()
          })
        )
        .required()
    }),
    query: Yup.object().shape({
      name: Yup.string(),
      fancyName: Yup.string(),
      group: Yup.string(),
      ie: Yup.string(),
      cnpj: Yup.lazy((data) => {
        if (!data) return Yup.string()
        return YupCNPJ.verify()
      })
    }),
    params: Yup.object().shape({
      groupId: Yup.string().uuid(),
      id: Yup.string().uuid()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
