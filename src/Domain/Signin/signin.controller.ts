import { Request, Response } from 'express'
import { OK } from 'http-status'

import { Service } from './signin.service'
import { View } from './signin.view'
import { View as ViewPermissions } from '@/Domain/UserPermission/userPermission.view'
import { View as ViewUserRole } from '@/Domain/UserRole/userRole.view'

export class Controller {
  private $service: Service
  private $view: View
  private $viewPermissions: ViewPermissions
  private $viewUserRole: ViewUserRole

  constructor({
    $Service = Service,
    $View = View,
    $ViewPermissions = ViewPermissions,
    $ViewUserRole = ViewUserRole
  } = {}) {
    this.$service = new $Service()
    this.$view = new $View()
    this.$viewPermissions = new $ViewPermissions()
    this.$viewUserRole = new $ViewUserRole()
  }

  public async handle(req: Request, res: Response) {
    const created = await this.$service.handle(req)

    return res
      .status(OK)
      .send(
        this.$view.transformOne(
          created.created,
          created.permissions,
          created.language
        )
      )
  }
}
