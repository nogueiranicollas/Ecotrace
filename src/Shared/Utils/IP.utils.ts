import { Request } from 'express'

import { Req } from '@/Shared/Protocols'

import { Sanitizer } from './sanitizers.utils'

export class IP {
  public static extract(req: Req | Request) {
    const _ipPart = req.headers['x-forwarded-for']
    const __ipPart = req.connection.remoteAddress
    const IP = Sanitizer.IP(_ipPart || __ipPart)
    return IP
  }
}
