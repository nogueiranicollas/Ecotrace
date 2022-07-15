import { RequestHandler, Router } from 'express'

import {
  authentication,
  ensureUserRoleMiddleware,
  identifyApp,
  sanitizeStrings
} from '@/Shared/Middlewares'

import { Router as BiomeRouter } from '@/Domain/Biomes'
import { Router as ChartsRouter } from '@/Domain/Charts'
import { Router as CityRoute } from '@/Domain/City'
import { Router as CompanyGroupRouter } from '@/Domain/CompanyGroup'
import { Router as CompanyGroupRoleRouter } from '@/Domain/CompanyGroupRole'
import { Router as CompanyGroupProfileRouter } from '@/Domain/CompanyGroupProfile'
import { Router as CompanyRouter } from '@/Domain/Company'
import { Router as KpisRouter } from '@/Domain/Kpis'
import { Router as LanguageRouter } from '@/Domain/Language'
import { Router as OrderRouter } from '@/Domain/Order'
import { Router as OrderHistoryRouter } from '@/Domain/OrderHistory'
import { Router as PropertiesRouter } from '@/Domain/Properties'
import { Router as PropertyLogRouter } from '@/Domain/PropertyLog'
import { Router as PropertyProducersRouter } from '@/Domain/PropertyProducers'
import { Router as PwdRecoveryRouter } from '@/Domain/PwdRecovery'
import { Router as ReferenceRouter } from '@/Domain/Reference'
import { Router as RetailGroupRouter } from '@/Domain/RetailGroup'
import { Router as RetailRouter } from '@/Domain/Retail'
import { Router as SigninRouter } from '@/Domain/Signin'
import { Router as SignupRouter } from '@/Domain/Signup'
import { Router as TraceabilityRouter } from '@/Domain/Traceability'
import { Router as TraceabilityTotalizersRouter } from '@/Domain/TraceabilityTotalizers'
import { Router as TraceabilitySupplierRouter } from '@/Domain/TraceabilitySupplierTable'
import { Router as TraceabilityPropriertyRouter } from '@/Domain/TraceabilityPropriertyTable'
import { Router as TraceabilitySumaryRouter } from '@/Domain/TraceabilitySumary'
import { Router as TraceabilityOrderRouter } from '@/Domain/TraceabilityorderTable'
import { Router as TraceabilityWeavingRouter } from '@/Domain/TraceabilityWeavingTable'
import { Router as TraceabilityWiringRouter } from '@/Domain/TraceabilityWiringTable'
import { Router as ProductiveChainRouter } from '@/Domain/ProductiveChain'
import { Router as UserPermissionRouter } from '@/Domain/UserPermission'
import { Router as UserRoleRouter } from '@/Domain/UserRole'
import { Router as UserRouter } from '@/Domain/User'

type SubRouter = {
  requiredRole?: string
  router: Router
  slug: string
  unprotected?: boolean
}

class ApiRouter {
  public router = Router()

  constructor({
    authMiddleware,
    ensureUserRoleMiddleware,
    middlewares,
    routers
  }) {
    this.setup({
      authMiddleware,
      ensureUserRoleMiddleware,
      middlewares,
      routers
    })
  }

  private setup({
    authMiddleware,
    middlewares = [],
    routers = []
  }: {
    authMiddleware: RequestHandler
    ensureUserRoleMiddleware: (role: string) => RequestHandler
    routers: SubRouter[]
    middlewares: RequestHandler[]
  }) {
    // -> general middlewares
    middlewares.map((middleware) => this.router.use(middleware))

    routers.map(({ requiredRole, router, slug, unprotected }) => {
      const routeMiddlewares: RequestHandler[] = []
      if (!unprotected) routeMiddlewares.push(authMiddleware)
      if (requiredRole) {
        routeMiddlewares.push(ensureUserRoleMiddleware(requiredRole))
      }
      this.router.use(slug, routeMiddlewares, router)
    })
  }
}

export default new ApiRouter({
  authMiddleware: authentication,
  ensureUserRoleMiddleware: ensureUserRoleMiddleware,
  middlewares: [identifyApp, sanitizeStrings],
  routers: [
    // Routers
    { slug: '/biomes', router: BiomeRouter },
    { slug: '/city', router: CityRoute },
    { slug: '/properties', router: PropertiesRouter },
    { slug: '/company-group', router: CompanyGroupRouter },
    { slug: '/company-group-role', router: CompanyGroupRoleRouter },
    { slug: '/company-group-profile', router: CompanyGroupProfileRouter },
    { slug: '/company', router: CompanyRouter },
    { slug: '/language', router: LanguageRouter },
    { slug: '/order', router: OrderRouter },
    { slug: '/orderHistory', router: OrderHistoryRouter },
    { slug: '/pwd-recovery', router: PwdRecoveryRouter, unprotected: true },
    { slug: '/retail-group', router: RetailGroupRouter },
    { slug: '/retail', router: RetailRouter },
    { slug: '/sign-in', router: SigninRouter, unprotected: true },
    { slug: '/sign-up', router: SignupRouter, unprotected: true },
    { slug: '/traceability', router: TraceabilityRouter },
    { slug: '/traceability-charts', router: ChartsRouter },
    { slug: '/traceability-totalizer', router: TraceabilityTotalizersRouter },
    { slug: '/traceability-order', router: TraceabilityOrderRouter },
    { slug: '/traceability-proprierty', router: TraceabilityPropriertyRouter },
    { slug: '/traceability-sumary', router: TraceabilitySumaryRouter },
    { slug: '/traceability-supplier', router: TraceabilitySupplierRouter },
    { slug: '/traceability-weaving', router: TraceabilityWeavingRouter },
    { slug: '/traceability-wiring', router: TraceabilityWiringRouter },
    { slug: '/productive-chain', router: ProductiveChainRouter },
    { slug: '/user-role', router: UserRoleRouter },
    { slug: '/user', router: UserRouter },
    { slug: '/userpermission', router: UserPermissionRouter },
    { slug: '/kpis', router: KpisRouter },
    { slug: '/reference', router: ReferenceRouter },
    { slug: '/propertyProducer', router: PropertyProducersRouter },
    { slug: '/propertyLog', router: PropertyLogRouter }
  ]
}).router
