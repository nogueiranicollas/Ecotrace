/* eslint-disable no-template-curly-in-string */
import { setLocale } from 'yup'

const translation = {
  array: {
    max: '${path} deve conter no máximo ${max} itens',
    min: '${path} deve conter no mínimo ${min} itens'
  },
  date: {
    max: '${path} deve ser anterior à ${max}',
    min: '${path} deve ser mais recente que ${min}'
  },
  mixed: {
    default: '${path} é inválido',
    notOneOf: '${path} não pode ser igual à um destes valores: ${values}',
    oneOf: '${path} deve ser igual à um dos seguintes valores: ${values}',
    required: '${path} é obrigatório'
  },
  number: {
    integer: '${path} deve ser inteiro',
    lessThan: '${path} deve ser menor à ${less}',
    max: '${path} deve ser no máximo ${max}',
    min: '${path} deve ser no mínimo ${min}',
    moreThan: '${path} deve ser maior à ${more}',
    negative: '${path} deve ser negativo',
    notEqual: '${path} não pode ser igual à ${notEqual}',
    positive: '${path} deve ser positivo'
  },
  string: {
    email: '${path} não contém um e-mail inválido',
    length: '${path} deve conter exatamente ${length} caracteres',
    lowercase: '${path} deve ser maiúsculo',
    max: '${path} deve conter no máximo ${max} caracteres',
    min: '${path} deve conter pelo menos ${min} caracteres',
    trim: '${path} não deve conter espaços em branco em início ou final.',
    uppercase: '${path} deve ser minúsculo',
    url: '${path} não contém uma URL válida'
  }
}

setLocale(translation)
