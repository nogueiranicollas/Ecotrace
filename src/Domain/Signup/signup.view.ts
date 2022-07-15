import { omit } from 'lodash'

type Signup = Record<string, any>
type SignupView = Record<string, any>

export class View {
  transformOne(item: Signup): SignupView {
    return omit(
      item,
      'createdAt',
      'deletedAt',
      'emailValidationToken',
      'phoneValidationToken',
      'pwd',
      'pwdRecoveryToken',
      'updatedAt'
    )
  }

  transformMany(items: Signup[]): SignupView[] {
    return items.map(this.transformOne)
  }
}
