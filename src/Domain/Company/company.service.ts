import { BAD_REQUEST } from 'http-status'

import { AuthReq, AppError, Req, WithFileReq } from '@/Shared/Protocols'
import { $errors, MulterUtils } from '@/Shared/Utils'

import { Service as FileService } from '@/Domain/File/file.service'
import { Repository as CompanyPhotosRepo } from '@/Domain/CompanyPhotos/companyPhotos.repository'
import { Repository as EmployeeRepo } from '@/Domain/Employee/employee.repository'

import { Company } from './company.entity'
import { CompanyPayload, Repository } from './company.repository'
import { Validator } from './company.validator'

type Employee = {
  bio: string
  doc: string
  name: string
}

type CompanyQs = {
  name?: string
  fancyName?: string
  cnpj?: string
  qualifications?: string
}

export class Service {
  private $repo: Repository
  private $validator: Validator

  private $employee: EmployeeRepo
  private $file: FileService
  private $companyPhotosRepo: CompanyPhotosRepo

  constructor({
    $Validator = Validator,
    $Repository = Repository,
    $EmployeeRepo = EmployeeRepo,
    $File = FileService,
    $CompanyPhotos = CompanyPhotosRepo
  } = {}) {
    this.$repo = new $Repository()
    this.$validator = new $Validator()

    this.$employee = new $EmployeeRepo()
    this.$file = new $File()
    this.$companyPhotosRepo = new $CompanyPhotos()
  }

  private mapEmployees({ technician, manager }) {
    const employees: { employee: Employee; role: string }[] = []
    if (technician) employees.push({ employee: technician, role: 'technician' })
    if (manager) employees.push({ employee: manager, role: 'manager' })

    return employees
  }

  public async find(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload: qs, validationErrors: qsValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ groupId: string }>(req),
      this.$validator.validateQuery<CompanyQs>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!qs) throw qsValidationErrors

    return this.$repo.find(
      { page: Number(page), limit: Number(limit) },
      { ...params, ...qs }
    )
  }

  public async findOne(req: Req) {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors
    return this.$repo.findOne(payload) as Promise<Company>
  }

  public async findUnrelatedWithGroup(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload: qs, validationErrors: qsValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ groupId: string }>(req),
      this.$validator.validateQuery<CompanyQs>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!qs) throw qsValidationErrors

    return this.$repo.findUnrelatedWithGroup(
      { page: Number(page), limit: Number(limit) },
      { ...params, ...qs }
    )
  }

  public async createOne(req: Req): Promise<Company> {
    const { payload, validationErrors } = await this.$validator.validateBody<
      CompanyPayload & { technician: Employee; manager: Employee }
    >(req)
    if (!payload) throw validationErrors

    const employees = this.mapEmployees(payload)
    const created = await this.$repo.insertOne({ ...payload, employees })
    return created
  }

  public async uploadEmployeePhoto(req: WithFileReq): Promise<boolean> {
    const { id, role } = req.params
    const found = (await this.$repo.findOne({ id })) as Company

    const employee = found.employees.find((e) => e.role === role)
    if (!employee) throw new AppError($errors.notFound, { query: { id, role } })

    const file = MulterUtils.mapFilePayload(req)
    if (employee.employee.photo) {
      await this.$file.replaceOne(file, employee.employee.photo)
      return true
    }

    const newFile = await this.$file.insertOne(file)
    await this.$employee.setProfilePhoto({
      id: employee.employee.id,
      photoId: newFile.id
    })
    return true
  }

  public async removeCompanyPhoto(req: AuthReq): Promise<boolean> {
    const { companyId, photoId: id } = req.params

    await this.$companyPhotosRepo.removeOne({ id })
    await this.$file.removeOne({ id })

    const company = (await this.$repo.findOne({ id: companyId })) as Company
    const photos = company.photos.filter((e) => e.id !== id)

    await this.$repo.updateOne({ ...company, photos })

    return true
  }

  public async uploadCompanyPhoto(req: WithFileReq): Promise<boolean> {
    const { id } = req.params
    const { photoId } = req.query

    const found = (await this.$repo.findOne({ id })) as Company
    const file = MulterUtils.mapFilePayload(req)

    if (!photoId) {
      if (!found.photos || found.photos.length < 4) {
        const newFile = await this.$file.insertOne(file)
        await this.$repo.updateCompanyPhotos({ ...found, photos: [newFile] })
        return true
      }

      throw new AppError(
        {
          code: 'COMPANY_PHOTOS_LIMIT_EXCEEDED',
          status: BAD_REQUEST,
          message: 'O limite de fotos foi atingido.'
        },
        { id }
      )
    }

    const old = found.photos.find((e) => e.fileId === photoId)
    if (!old) throw new AppError($errors.notFound, { query: { id, photoId } })
    await this.$file.replaceOne(file, old.file)
    return true
  }

  public async updateOne(req: Req): Promise<Company> {
    const [
      { payload: params, validationErrors: paramValidationErrors },
      { payload, validationErrors: bodyValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ id: string }>(req),
      this.$validator.validateBody<
        CompanyPayload & { technician: Employee; manager: Employee }
      >(req)
    ])
    if (!params) throw paramValidationErrors
    if (!payload) throw bodyValidationErrors

    const employees = this.mapEmployees(payload)
    const updated = await this.$repo.updateOne({
      ...payload,
      ...params,
      employees
    })
    return updated
  }

  public async findByGroup(req: Req) {
    const { limit = 10, page = 0 } = req.query
    const [
      { payload: params, validationErrors: paramsValidationErrors },
      { payload: qs, validationErrors: qsValidationErrors }
    ] = await Promise.all([
      this.$validator.validateParams<{ groupId: string }>(req),
      this.$validator.validateQuery<{
        name: string
        fancyName: string
        cnpj: string
      }>(req)
    ])
    if (!params) throw paramsValidationErrors
    if (!qs) throw qsValidationErrors

    return this.$repo.findByGroup(
      { page: Number(page), limit: Number(limit) },
      { ...params, ...qs }
    )
  }

  public async removeOne(req: Req): Promise<string> {
    const { payload, validationErrors } = await this.$validator.validateParams<{
      id: string
    }>(req)
    if (!payload) throw validationErrors

    await this.$repo.removeOne(payload)
    return payload.id
  }

  public async removeMany(req: Req): Promise<string[]> {
    const { payload, validationErrors } = await this.$validator.validateBody<{
      ids: string[]
    }>(req)
    if (!payload) throw validationErrors

    await Promise.all(payload.ids.map((id) => this.$repo.removeOne({ id })))
    return payload.ids
  }
}
