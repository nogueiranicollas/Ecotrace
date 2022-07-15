import { string } from 'yup'

import { isValid as validateCPF } from 'cpf'

class Validator extends string {
  public verify() {
    return this.test('cpf', 'Valor inválido', function (val) {
      const { path, createError } = this
      const message = createError({
        path,
        message: `${path} não contém um valor válido`
      })

      if (!val) return message

      const isValid = validateCPF(val)
      if (isValid) return true

      return message
    })
  }
}

export const cpf = new Validator()
