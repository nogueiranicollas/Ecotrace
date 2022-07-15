import { isValid as validateCPF } from 'cpf'
import { string as YupString } from 'yup'

class YupCpfValidator extends YupString {
  public verify() {
    return this.test('CPF', 'Valor inválido', function(val) {
      const { path, createError } = this
      const message = createError({
        path,
        message: `${path} não contém um valor válido`
      })

      if (!val) return message

      const isCPFValid = validateCPF(val)
      if (isCPFValid) return true
      return message
    })
  }
}

export const YupCPF = new YupCpfValidator()
