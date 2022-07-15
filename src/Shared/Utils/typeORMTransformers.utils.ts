import { Formatter } from './formatters.utils'
import { Sanitizer } from './sanitizers.utils'

export class TypeORMTransformers {
  public static CEP = { from: Formatter.CEP, to: Sanitizer.CEP }
  public static CNPJ = { from: Formatter.CNPJ, to: Sanitizer.CNPJ }
  public static CPF = { from: Formatter.CPF, to: Sanitizer.CPF }
  public static CPFCNPJ = {
    from: Formatter.CPFCNPJ,
    to: Sanitizer.CPFCNPJ
  }

  public static isento = {
    from: (val: string): string => (!val ? 'ISENTO' : val),
    to: (val: string): string => {
      const value = val?.toString().trim().toUpperCase() || ''
      return value === 'ISENTO' ? '' : value
    }
  }

  public static phone = { from: Formatter.phone, to: Sanitizer.phone }
  public static array = {
    from: (val) => {
      if (!val) return []
      return val.split(';')
    },
    to: (val) => {
      if (!val || !val.length) return ''
      if (!Array.isArray(val)) return val
      return val.join(';')
    }
  }
}
