import { string } from 'yup'

import { validate as validateCNPJ } from 'cnpj'
import { isValid as validateCPF } from 'cpf'

class Validator extends string {
  public verify() {
    return this.test('cpfcnpj', 'Valor inválido', function (val) {
      const { path, createError } = this
      const message = createError({
        path,
        message: `${path} não contém um valor válido`
      })

      if (!val) return message

      const isCPFValid = validateCPF(val)
      if (isCPFValid) return true

      const isCNPJValid = validateCNPJ(val)
      if (isCNPJValid) return true

      return message
    })
  }
}

export const cpfcnpj = new Validator()
