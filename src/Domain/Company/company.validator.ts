import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'
import { YupCNPJ, YupCPF } from '@/Shared/Utils'

export class Validator extends YupValidator {
  public static schemas = {
    default: Yup.object().shape({
      fancyName: Yup.string().required(),
      name: Yup.string().required(),
      cnpj: YupCNPJ.verify().required(),
      ie: Yup.string().required(),
      status: Yup.boolean().required(),
      qualifications: Yup.array().of(Yup.string().required()).required(),
      address: Yup.string().required(),
      country: Yup.string().required(),
      state: Yup.string().nullable(true),
      city: Yup.string().nullable(true),
      microregion: Yup.string().nullable(true),
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
        .required(),
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
      technician: Yup.object()
        .shape({
          bio: Yup.string().required(),
          doc: Yup.string().required(),
          name: Yup.string().required()
        })
        .required(),
      manager: Yup.object()
        .shape({
          bio: Yup.string().required(),
          doc: YupCPF.verify().required(),
          name: Yup.string().required()
        })
        .required()
    }),
    destroy: Yup.object().shape({
      ids: Yup.array().of(Yup.string().uuid().required()).required()
    }),
    params: Yup.object().shape({
      groupId: Yup.string().uuid(),
      id: Yup.string().uuid()
    }),
    query: Yup.object().shape({
      cnpj: Yup.lazy((cnpj) => {
        if (!cnpj) return Yup.string()
        return YupCNPJ.verify()
      }),
      name: Yup.string(),
      fancyName: Yup.string(),
      group: Yup.string(),
      ie: Yup.string(),
      qualifications: Yup.string()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
