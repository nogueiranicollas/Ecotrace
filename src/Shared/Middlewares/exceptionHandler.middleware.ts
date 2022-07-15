import { Response, NextFunction, Request } from 'express'
import { INTERNAL_SERVER_ERROR } from 'http-status'
import Youch from 'youch'
import forTerminal from 'youch-terminal'

import { app } from '@/Config'

import { AppError, AppValidationError, WithErrorReq } from '@/Shared/Protocols'

export async function exceptionHandler(
  err: Error,
  request: Request | WithErrorReq,
  response: Response,
  __: NextFunction
): Promise<any> {
  const { error } = request as WithErrorReq

  if (app.env === 'development') {
    const youchErr = new Youch(err, request)
    const jsonErr = await youchErr.toJSON()

    console.log(err)
    console.log(JSON.stringify(error, null, 2))
    console.log(forTerminal(jsonErr))
  }

  if (err instanceof AppValidationError) {
    return response.status(err.status).json(err.toJSON())
  }

  if (err instanceof AppError) {
    return response.status(err.status).json({
      ...err.toJSON(),
      err: error
    })
  }

  return response.status(INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal server error'
  })
}
