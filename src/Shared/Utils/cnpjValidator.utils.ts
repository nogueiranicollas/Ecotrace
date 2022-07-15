import { validate as validateCNPJ } from 'cnpj'
import { string as YupString } from 'yup'

class YupCnpjValidator extends YupString {
  public verify() {
    return this.test('CNPJ', 'Valor inválido', function (val) {
      const { path, createError } = this
      const message = createError({
        path,
        message: `${path} não contém um valor válido`
      })

      if (!val) return message

      const isCNPJValid = validateCNPJ(val)
      if (isCNPJValid) return true
      return message
    })
  }
}

export const YupCNPJ = new YupCnpjValidator()
