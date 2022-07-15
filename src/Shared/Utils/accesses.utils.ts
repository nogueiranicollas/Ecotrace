import { Accesses } from '@/Shared/Protocols'

function convertArrayInSqlIn(items) {
  return items.map((e) => `'${e}'`).join(', ')
}

export function joinWithConditions(conditions: string, accessesQuery: string) {
  if (conditions && accessesQuery) return `${conditions} AND ${accessesQuery}`
  else if (conditions && !accessesQuery) return `${conditions}`
  return accessesQuery
}

export function makeAccessesFilterQuery(
  accesses?: Accesses,
  table = 'pedidos'
) {
  if (!accesses || Object.keys(accesses).length === 0) return ''
  const { companies, retails } = accesses
  const query: string[] = []

  if (companies && companies.length) {
    const field =
      table === 'origem_industria_cliente'
        ? 'industry_doc'
        : 'p.cnpj_local_estoque'
    const origem = convertArrayInSqlIn(companies)
    query.push(`(${field} IN (${origem}))`)
  }

  if (retails && retails.length) {
    const field =
      table === 'origem_industria_cliente' ? 'client_doc' : 'p.nf_cnpj_destino'
    const destino = convertArrayInSqlIn(retails)
    query.push(`(${field} IN (${destino}))`)
  }

  return query.join(' AND ').trim()
}
