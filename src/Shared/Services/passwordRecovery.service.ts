import {
  pwdRecovery as config,
  email as emailConfig,
  ui as UIConfig
} from '@/Config'
import { AppError } from '@/Shared/Protocols'
import { Email, Template } from '@/Shared/Providers'
import { $errors, Generator } from '@/Shared/Utils'

import { User } from '@/Domain/User/user.entity'

export class PasswordRecovery {
  private $email: Email
  private $template: Template
  private $generator: typeof Generator

  constructor({
    $Email = Email,
    $Template = Template,
    $Generator = Generator
  } = {}) {
    this.$email = new $Email()
    this.$template = new $Template()
    this.$generator = $Generator
  }

  private handleWithTargetAddress({ name, email, emailRecovery }: User) {
    const targets = [`${name} <${email}>`]
    if (emailRecovery) targets.push(`${name} <${emailRecovery}>`)
    return targets
  }

  public async notify(user: User): Promise<string> {
    const to = this.handleWithTargetAddress(user)
    const token = this.$generator.alpha(config.tokenLength)

    const { from } = emailConfig
    const { emailSubject: subject } = config
    const content = await this.$template.populate(config.templateName, {
      baseURL: UIConfig.url,
      link: `${UIConfig.url}${UIConfig.paths.pwdRecovery}=${token}&email=${user.email}`
    })

    const success = await this.$email.send({ to, content, subject, from })
    if (!success) throw new AppError($errors.failToRequestEmailConfirmation)
    return token
  }
}
