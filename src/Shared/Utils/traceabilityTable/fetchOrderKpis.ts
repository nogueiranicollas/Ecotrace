import { joinWithConditions } from '..'
import { QUERY_COLLECTION } from './kpis.query'

export async function fetchOrderKpis({
  db,
  params,
  queryCollection = QUERY_COLLECTION,
  accesses
}) {
  const _queryCollection = { ...queryCollection.kpis } as any

  if (params.locations) {
    delete _queryCollection.invoices
    delete _queryCollection.trackedTons
    delete _queryCollection.volumeDelivered
  }

  const pairs = await Promise.all(
    Object.keys(_queryCollection).map(async (kpi) => {
      const queries = queryCollection.kpis[kpi]
      const conditions = Object.keys(params)
        .filter((paramName) => {
          const isDefined = !!params[paramName]
          const existsInCollection = !!queries[paramName]
          return isDefined && existsInCollection
        })
        .map((paramName) => {
          const baseQuery = queries[paramName]
          const query = baseQuery(params[paramName])
          return query
        })
        .join(' AND ')

      const _conditions = joinWithConditions(
        conditions,
        queries.accessesFilter(accesses)
      )

      const query = queries.query(_conditions)

      const { rows } = await db.raw(query)

      if (rows) return [kpi, Number(rows[0].count || 0)]
      return [kpi, 0]
    })
  )

  if (params.locations) return pairs[0]

  const kpis = Object.fromEntries(pairs)

  return {
    ...kpis
  }
}
