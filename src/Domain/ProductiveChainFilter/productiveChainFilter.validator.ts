import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export const validator = new YupValidator({
  query: Yup.object().shape({
    datestart: Yup.date(),
    dateend: Yup.date(),
    order: Yup.bool(),
    invoice: Yup.bool(),
    production: Yup.bool(),
    deliveryEstimate: Yup.bool(),
    suppliercnpj: Yup.string(),
    suppliername: Yup.string(),
    retail: Yup.bool(),
    provider: Yup.bool(),
    weaving: Yup.bool(),
    wiring: Yup.bool(),
    property: Yup.bool(),
    companyGroups: Yup.array().of(Yup.string()),
    orderNumber: Yup.string(),
    invoiceNumber: Yup.string(),
    qrCode: Yup.string()
  })
})
