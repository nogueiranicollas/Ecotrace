import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'
import { YupCPF } from '@/Shared/Utils'

export class Validator extends YupValidator {
  public static schemas = {
    params: Yup.object().shape({
      id: Yup.string().required().uuid()
    }),
    query: Yup.object().shape({
      name: Yup.string(),
      phone: Yup.string(),
      email: Yup.string().email(),
      CPF: Yup.lazy((data) => {
        if (!data) return Yup.string()
        return YupCPF.verify()
      }),
      department: Yup.string(),
      retail: Yup.string().uuid(),
      companiesGroups: Yup.string().uuid(),
      roleId: Yup.string()
    }),
    store: Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      CPF: YupCPF.verify().required(),
      email: Yup.string().email().trim().lowercase().required(),
      password: Yup.string().min(6).max(32).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'deve ser igual à senha.')
        .required(),
      emailRecovery: Yup.string().email(),
      phone: Yup.string().required(),
      phoneRecovery: Yup.string(),
      department: Yup.string(),
      companies: Yup.array().of(Yup.string().strict(true).required()),
      retails: Yup.array().of(Yup.string().strict(true).required()),
      companiesGroups: Yup.array().required(),
      languageId: Yup.string().required(),
      permissions: Yup.object().shape({
        userId: Yup.string(),
        retail: Yup.boolean(),
        provider: Yup.boolean(),
        weaving: Yup.boolean(),
        wiring: Yup.boolean(),
        productiveChain: Yup.boolean(),
        traceabilityProperty: Yup.boolean(),
        blockchainHistory: Yup.boolean(),
        users: Yup.boolean(),
        industries: Yup.boolean(),
        industriesGroup: Yup.boolean(),
        propertyRegister: Yup.boolean()
      }),
      roleId: Yup.string()
        .uuid('deve ser um tipo de usuário válido.')
        .required()
    }),
    update: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
      CPF: Yup.lazy((data) => {
        if (!data) return Yup.string()
        return YupCPF.verify()
      }),
      email: Yup.string().email().trim().lowercase(),
      password: Yup.string().min(6).max(32),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'deve ser igual à senha.'
      ),
      languageId: Yup.string(),
      companiesGroups: Yup.array(),
      emailRecovery: Yup.string()
        .email()
        .trim()
        .lowercase()
        .notOneOf(
          [Yup.ref('email')],
          'E-mail de recuperação de senha não pode ser igual campo E-mail'
        ),
      phone: Yup.string(),
      phoneRecovery: Yup.string(),
      department: Yup.string(),
      companies: Yup.array().of(Yup.string().strict(true).required()),
      retails: Yup.array().of(Yup.string().strict(true).required()),
      permissions: Yup.object().shape({
        userId: Yup.string(),
        retail: Yup.boolean(),
        provider: Yup.boolean(),
        weaving: Yup.boolean(),
        wiring: Yup.boolean(),
        productiveChain: Yup.boolean(),
        traceabilityProperty: Yup.boolean(),
        blockchainHistory: Yup.boolean(),
        users: Yup.boolean(),
        industries: Yup.boolean(),
        industriesGroup: Yup.boolean(),
        propertyRegister: Yup.boolean()
      }),
      roleId: Yup.string().uuid('deve ser um tipo de usuário válido.')
    }),
    updateProfile: Yup.object().shape({
      languageId: Yup.string()
    }),
    updatePwd: Yup.object().shape({
      id: Yup.string().required(),
      currentPassword: Yup.string().min(6).max(32).required(),
      password: Yup.string().min(6).max(32).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'deve ser igual à senha.')
        .required()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
