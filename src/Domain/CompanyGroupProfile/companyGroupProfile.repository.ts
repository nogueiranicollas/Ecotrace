import { EntityRepository, Repository as _Repository } from 'typeorm'
import { FindConditions } from 'typeorm/find-options/FindConditions'

import { $errors, getTypeORMCustomRepo } from '@/Shared/Utils'

import { CompanyGroupProfile } from './companyGroupProfile.entity'
import { AppError } from '@/Shared/Protocols'

interface CompanyGroupProfileRepo extends _Repository<CompanyGroupProfile> {}

type CompanyQuery = FindConditions<CompanyGroupProfile> | FindConditions<CompanyGroupProfile>[]

@EntityRepository(CompanyGroupProfile)
class TypeORMRepo
  extends _Repository<CompanyGroupProfile>
  implements CompanyGroupProfileRepo {}

export class Repository {
  private $getRepo: () => CompanyGroupProfileRepo

  constructor({
    repo = getTypeORMCustomRepo<CompanyGroupProfileRepo>(TypeORMRepo)
  } = {}) {
    this.$getRepo = repo
  }

  public async find(query = {}) {
    const found = await this.$getRepo().find({ where: query })
    if (!found.length) throw new AppError($errors.notFound, { query })
    return found
  }

  //Create function that will be used to save the companyGroupProfile
  public async insertOne(companyGroupProfile: CompanyGroupProfile) {
    return await this.$getRepo().save(companyGroupProfile)
  }

  public async findAlreadyRelatedWithGroup(
    { limit, page },
    { groupId }: CompanyQuery & { groupId: string }
  ) {
    const res = await Promise.all([
      this.$getRepo()
        .createQueryBuilder('company_group_profile')
        // .innerJoin('company_group_profiles.company_group_profile_id', 'company_group_profile')
        // .select('company_group_profiles')
        // .where('company_group_profiles.company_group_id = :groupId', { groupId })
        .getCount()
      ,
      this.$getRepo()
        .createQueryBuilder('company_group_profile')
        .innerJoin('company_group_profile.company_group_profiles', 'company_group_profiles')
        .where('company_group_profiles.company_group_id = :groupId', { groupId })
        .skip(page * limit)
        .take(limit)
        .getMany()
    ])

    const [totalItems, items] = res

    const count = Number(totalItems)

    const totalPages =
      totalItems <= limit ? 1 : parseInt((count / limit).toFixed())

    const companies = {
      items,
      pagination: {
        totalPages,
        totalItems: count,
        page,
        limit
      }
    }

    return companies
  }
}
