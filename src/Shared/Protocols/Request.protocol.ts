import { Request } from 'express'

import { AppError } from '@/Shared/Protocols/AppError.protocol'

import { App } from '@/Domain/App/app.entity'
import { User } from '@/Domain/User/user.entity'

export type RawFile = {
  destination: string
  encoding: string
  fieldname: string
  filename: string
  key: string
  location: string
  mimetype: string
  originalname: string
  path: string
  size: number
  src: string
  storage: string
}

export type ReqFile = {
  ext: string
  filename: string
  key: string
  mime: string
  src: string
  storage: string
}

export type Req = Request
export type WithFileReq = Req & { file: RawFile }
export type AuthReq = Request & {
  user: {
    accesses: { companies: string[]; retails: string[] }
    app: App
    bearer: User
  }
}
export type WithErrorReq = Req & { error: AppError }
