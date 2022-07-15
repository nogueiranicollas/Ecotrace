import { captureException } from '@sentry/node'
import { Credentials, Endpoint, SES } from 'aws-sdk'
import { get } from 'lodash'

import { email as config } from '@/Config'

type EmailContent = {
  html: string
  text: string
}

type EmailConfig = {
  from: string
  to: string | string[]
  subject: string
  content: EmailContent
}

type SESAdapterConfig = {
  credentials?: Credentials
  endpoint?: Endpoint
  region: string
}

type ProviderConfig = {
  credentials?: Credentials
  endpoint?: Endpoint
  engine: string
  region: string
}

interface EmailEngine {
  send(config: EmailConfig): Promise<boolean>
}

class SESAdapter implements EmailEngine {
  private client: SES

  constructor({ credentials, endpoint, region }: SESAdapterConfig) {
    this.client = new SES({ credentials, endpoint, region })
  }

  private handleWithTo(to: string | string[]) {
    if (Array.isArray(to)) return to
    return [to]
  }

  public async send({ from, to, subject, content }: EmailConfig) {
    const { html, text } = content
    try {
      await this.client
        .sendEmail({
          Destination: { ToAddresses: this.handleWithTo(to) },
          Message: {
            Body: {
              Html: { Charset: 'UTF-8', Data: html },
              Text: { Charset: 'UTF-8', Data: text }
            },
            Subject: { Charset: 'UTF-8', Data: subject }
          },
          Source: from
        })
        .promise()
      return true
    } catch (ex) {
      captureException(ex)
      return false
    }
  }
}

export class Email {
  private engine: EmailEngine

  constructor({
    credentials,
    endpoint,
    engine,
    region
  }: ProviderConfig = config) {
    const engines = { SES: SESAdapter }

    const Engine = get(engines, engine, engines.SES)
    this.engine = new Engine({ credentials, endpoint, region })
  }

  async send(message: EmailConfig) {
    if (config.enabled) return this.engine.send(message)
    return true
  }
}
