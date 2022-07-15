import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'
import { YupCNPJ } from '@/Shared/Utils'

export class Validator extends YupValidator {
  public static schemas = {
    linkCompanies: Yup.object().shape({
      companyIds: Yup.array().of(Yup.string().uuid().required()).required()
    }),
    default: Yup.object().shape({
      adminEmail: Yup.string().email().required(),
      adminName: Yup.string().required(),
      cnpj: YupCNPJ.required(),
      name: Yup.string().required(),
      companyGroupRoleId: Yup.string().required(),
      companyGroupProfiles: Yup.array().required(),
      visible: Yup.boolean().required()
    }),
    destroy: Yup.object().shape({
      ids: Yup.array().of(Yup.string().uuid().required())
    }),
    params: Yup.object().shape({
      id: Yup.string().uuid().required()
    }),
    query: Yup.object()
      .shape({
        name: Yup.string(),
        adminEmail: Yup.string().email().default('')
      })
      .camelCase()
  }

  constructor() {
    super(Validator.schemas)
  }
}
