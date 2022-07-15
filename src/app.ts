import 'reflect-metadata'

import 'express-async-errors'
import compression from 'compression'
import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import {
  api as ApiConfig,
  app as AppConfig,
  sentry as SentryConfig,
  upload as UploadConfig
} from './Config'
import { router } from './Router'
import { DB } from './Shared/Database'

class Server {
  public server: Application

  constructor() {
    this.server = express()

    this.setup()
  }

  private setup(): void {
    DB.connect()

    Sentry.init({
      ...SentryConfig,

      environment: AppConfig.env,

      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: this.server })
      ],

      tracesSampleRate: 1.0
    })

    this.server.use(compression())
    this.server.use(cors())
    this.server.use(express.json({ limit: '32MB' }))
    this.server.use(express.urlencoded({ extended: true, limit: '8MB' }))
    this.server.use(logger(AppConfig.env === 'development' ? 'dev' : 'tiny'))
    this.server.use(helmet())

    this.server.use(router)
    if (UploadConfig.provider === 'disk') {
      this.server.use(
        `/${UploadConfig.folderName}`,
        express.static('./static', { immutable: true })
      )
    }

    this.server.enable('trust proxy')
  }

  public listen(): void {
    // ==> Showing API running infos
    console.log('')
    console.log('[API] ONLINE!')
    console.log(`[API] Mode: ${AppConfig.env}`)
    console.log(`[API] Port: ${ApiConfig.port}`)
    console.log('')
  }
}

export default () => new Server()
