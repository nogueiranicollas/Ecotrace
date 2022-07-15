import * as Yup from 'yup'

import { YupValidator } from '@/Shared/Providers'

const schemas = {
  default: Yup.object().shape({}),
  query: Yup.object()
    .shape({
      firstColumn: Yup.number().default(0),
      secondColumn: Yup.number().default(0),
      thirdColumn: Yup.number().default(0),
      begin: Yup.date(),
      days: Yup.array().of(Yup.number()),
      end: Yup.date(),
      months: Yup.array().of(Yup.number()),
      years: Yup.array().of(Yup.number())
    })
    .from('dtStart', 'begin')
    .from('dtFinal', 'end')
}
export const Validator = new YupValidator(schemas)
