import {
  EntityRepository,
  FindConditions,
  Repository as _Repository
} from 'typeorm'

import { getTypeORMCustomRepo } from '@/Shared/Utils'

import { Token } from './token.entity'

export type TokenQuery = FindConditions<Token> | FindConditions<Token>[]
type TokenPayload = Omit<
  Token,
  'id' | 'bearerId' | 'createdAt' | 'deletedAt' | 'updatedAt'
>

interface TokenRepo extends _Repository<Token> {}

@EntityRepository(Token)
class TypeORMRepo extends _Repository<Token> implements TokenRepo {}

export class Repository {
  private $getRepo: () => TokenRepo

  constructor({ repo = getTypeORMCustomRepo<TokenRepo>(TypeORMRepo) } = {}) {
    this.$getRepo = repo
  }

  public async findOne(where: TokenQuery, relations = ['bearer']) {
    return this.$getRepo().findOne({ relations, where })
  }

  public async insertOne(payload: TokenPayload) {
    const repo = this.$getRepo()
    const created = repo.create(payload)
    await repo.save(created)
    return created
  }
}
