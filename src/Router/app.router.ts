import { Router } from 'express'
import * as Sentry from '@sentry/node'

import { api as apiConfig } from '@/Config'
import { exceptionHandler } from '@/Shared/Middlewares'

import apiRouter from './api.router'
import statusRouter from './status.router'

class AppRouter {
  public router = Router()

  constructor({ api, status, middlewares }) {
    this.setup({ api, status, middlewares })
  }

  private setup({ api, status, middlewares }) {
    middlewares.pre.map((middleware) => this.router.use(middleware))

    this.router.get(status.slug, status.method)
    this.router.use(api.slug, api.router)

    middlewares.pos.map((middleware) => this.router.use(middleware))
  }
}

export default new AppRouter({
  api: { router: apiRouter, slug: apiConfig.slugs.api },
  status: { method: statusRouter, slug: apiConfig.slugs.status },
  middlewares: {
    pre: [Sentry.Handlers.requestHandler(), Sentry.Handlers.tracingHandler()],
    pos: [Sentry.Handlers.errorHandler(), exceptionHandler]
  }
}).router
