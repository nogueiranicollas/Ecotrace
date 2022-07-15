import { omit, pick } from 'lodash'
import { Producer } from '@/Domain/Producer/producer.entity'
import { PropertyProducer } from '@/Domain/PropertyProducers/propertyProducers.entity'

import { ProductiveChain as Entity } from './productiveChain.entity'
import { OrderSummary } from './productiveChain.entity'
export class View {
  transformOne(item: any): Record<string, any> {

    return item
  }

  transformMany(items: Entity[]): Record<string, any>[] {
    return items.map((e) => this.transformOne(e))
  }
}
