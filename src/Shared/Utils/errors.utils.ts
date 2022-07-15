import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  FAILED_DEPENDENCY,
  SERVICE_UNAVAILABLE,
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED
} from 'http-status'

type Err = {
  status: number
  code: string
  message: string
}

export const $errors = {
  duplicated: {
    status: BAD_REQUEST,
    code: 'DUPLICATED',
    message: 'O documento informado já está registrado em nossa base de dados.'
  },
  duplicatedCPFCNPJIE: {
    status: BAD_REQUEST,
    code: 'DUPLICATED',
    message: 'CPF/CNPJ e IE duplicados ou já cadastrado em nossa base de dados.'
  },
  templateNotFound: {
    status: FAILED_DEPENDENCY,
    code: 'TEMPLATE_NOT_FOUND',
    message: 'O template solicitado não foi encontrado!'
  },
  invalidFormat: {
    status: BAD_REQUEST,
    code: 'INVALID_FORMAT',
    message: 'Os valores informados não correspondem aos tipos esperados.'
  },
  unknownValidationTarget: {
    status: UNPROCESSABLE_ENTITY,
    code: 'UNKNOWN_VALIDATION_TARGET',
    message: 'O esquema de validação informado é desconhecido'
  },
  failToRequestConfirmation: {
    status: SERVICE_UNAVAILABLE,
    code: 'REQUEST_CONFIRMATION_FAILS',
    message: 'Falhou ao tentar requisitar confirmação'
  },
  failToRequestEmailConfirmation: {
    status: SERVICE_UNAVAILABLE,
    code: 'REQUEST_EMAIL_CONFIRMATION_FAILS',
    message: 'Falhou ao tentar requisitar a confirmação por e-mail'
  },
  failToRequestPhoneConfirmation: {
    status: SERVICE_UNAVAILABLE,
    code: 'REQUEST_PHONE_CONFIRMATION_FAILS',
    message: 'Falhou ao tentar requisitar a confirmação por SMS'
  },
  invalidConfirmationToken: {
    status: BAD_REQUEST,
    code: 'INVALID_CONFIRMATION_TOKEN',
    message:
      'Os valores informados não correspondem a nenhum usuário ou já foram utilizados.'
  },
  notFound: {
    status: NOT_FOUND,
    code: 'NOT_FOUND',
    message: 'Nenhum registro encontrado'
  },
  validationFails: {
    status: BAD_REQUEST,
    code: 'INVALID_PAYLOAD',
    message:
      'O corpo recebido não contém todos os valores esperados ou não contém os tipos adequeados.'
  },
  loginFails: {
    status: BAD_REQUEST,
    code: 'INVALID_PAYLOAD',
    message: 'Dados inválidos'
  },
  paramsValidationFails: {
    status: BAD_REQUEST,
    code: 'INVALID_PARAMS',
    message:
      'Os parâmetros recebidos não contém todos os valores esperados ou não contém os tipos adequeados.'
  },
  tokenNotFound: {
    status: NOT_FOUND,
    code: 'TOKEN_NOT_FOUND',
    message: 'O token de autorização não foi informado'
  },
  invalidToken: {
    status: UNAUTHORIZED,
    code: 'INVALID_TOKEN',
    message: 'O token informado é inválido!'
  },
  invalidPassword: {
    status: UNAUTHORIZED,
    code: 'INVALID_PASSWORD',
    message: 'A senha informada está incorreta!'
  },
  invalidAccess: {
    status: FORBIDDEN,
    code: 'FORBIDDEN',
    message: 'O usuário autenticado não tem permissões suficientes!'
  },
  insufficientPermissions: {
    status: UNAUTHORIZED,
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Ao menos uma permissão deve ser informada'
  },
  passNeedsUpdate: {
    status: UNAUTHORIZED,
    code: 'PASS_NEEDS_UPDATE',
    message: 'A senha deve ser atualizada.'
  },
  phoneNeedsConfirmation: {
    status: UNAUTHORIZED,
    code: 'PHONE_NEEDS_CONFIRMATION',
    message: 'O telefone deve ser confirmado'
  },
  emailNeedsConfirmation: {
    status: UNAUTHORIZED,
    code: 'EMAIL_NEEDS_CONFIRMATION',
    message: 'O email deve ser confirmado'
  },
  authenticationFails: {
    status: UNAUTHORIZED,
    code: 'AUTHENTICATION_FAILS',
    message: 'As informações fornecidas não correspondem a nenhum usuário.'
  },
  unauthorized: {
    status: UNAUTHORIZED,
    code: 'UNAUTHORIZED',
    message: 'Você não tem autorização para prosseguir'
  },
  userStatusInvalid: {
    status: FORBIDDEN,
    code: 'USER_STATUS_INVALID',
    message: 'O usuário não tem permissões para entrar.'
  },
  serviceUnavailable: {
    status: 503,
    code: 'SERVICE_UNAVAILABLE',
    message: 'O serviço está indisponível no momento.'
  },
  needPermissions: {
    status: BAD_REQUEST,
    code: 'INVALID_PARAMS',
    message: 'Deve ser concedida ao menos 1 permissão ao usuário.'
  }
}

export function getErrByCode(code: string): Err {
  const error = Object.values($errors).find(({ code: each }) => each === code)
  return error as Err
}
