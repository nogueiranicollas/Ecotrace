import { EntityRepository, Repository as _Repository } from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { Signup } from './signup.entity'

export type SignupPayload = Omit<Signup, 'id' | 'createdAt'>

interface SignupRepo extends _Repository<Signup> {}

@EntityRepository(Signup)
class TypeORMRepo extends _Repository<Signup> implements SignupRepo {}

export class Repository {
  private $getRepo: () => SignupRepo

  constructor({ repo = getTypeORMCustomRepo<SignupRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async insertOne(payload: SignupPayload) {
    const repo = this.$getRepo()
    const created = await repo.save(repo.create(payload))
    return created
  }
}
