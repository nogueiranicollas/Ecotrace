import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

export const validator = new YupValidator({
  query: Yup.object().shape({
    dateselection: Yup.string(),
    ordernumber: Yup.string(),
    invoice: Yup.string(),
    productcode: Yup.string(),
    confectioncnpj: Yup.string(),
    originsupplier: Yup.string(),
    orderstatus: Yup.string(),
    isabrcertified: Yup.string(),
    datestart: Yup.date(),
    dateend: Yup.date(),
    car: Yup.string()
    // datestart: Yup.lazy((data) => {
    //   if (data) {
    //     return Yup.array().of(Yup.string())
    //   }
    //   return Yup.string()
    // }),
    // dateend: Yup.lazy((data) => {
    //   if (data) {
    //     return Yup.array().of(Yup.string())
    //   }
    //   return Yup.string()
    // })
  })
})
