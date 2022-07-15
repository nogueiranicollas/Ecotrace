import { EntityRepository, Repository } from 'typeorm'

import { City as Entity } from './city.entity'

@EntityRepository(Entity)
export class City extends Repository<Entity> {}
