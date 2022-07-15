import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export class Validator extends YupValidator {
  public static schemas = {
    params: Yup.object().shape({
      id: Yup.string().required().uuid()
    }),
    store: Yup.object().shape({
      userId: Yup.string().required().uuid(),
      retail: Yup.boolean().required(),
      provider: Yup.boolean().required(),
      weaving: Yup.boolean().required(),
      wiring: Yup.boolean().required(),
      productiveChain: Yup.boolean().required(),
      traceabilityProperty: Yup.boolean().required(),
      blockchainHistory: Yup.boolean().required(),
      users: Yup.boolean().required(),
      industries: Yup.boolean().required(),
      industriesGroup: Yup.boolean().required(),
      propertyRegister: Yup.boolean().required()
    }),
    update: Yup.object().shape({
      userId: Yup.string().required().uuid(),
      retail: Yup.boolean().required(),
      provider: Yup.boolean().required(),
      weaving: Yup.boolean().required(),
      wiring: Yup.boolean().required(),
      productiveChain: Yup.boolean().required(),
      traceabilityProperty: Yup.boolean().required(),
      blockchainHistory: Yup.boolean().required(),
      users: Yup.boolean().required(),
      industries: Yup.boolean().required(),
      industriesGroup: Yup.boolean().required(),
      propertyRegister: Yup.boolean().required()
    })
  }

  constructor() {
    super(Validator.schemas)
  }
}
