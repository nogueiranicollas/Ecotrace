import { joinWithConditions } from '..'
import { QUERY_COLLECTION } from './chartSupplier.query'

export async function fetchChartSupplier({
  db,
  params,
  queryCollection = QUERY_COLLECTION,
  accesses
}) {
  const pairs = await Promise.all(
    Object.keys(queryCollection.charts).map(async (chart) => {
      const queries = queryCollection.charts[chart]
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
        queryCollection.charts[chart].accessesFilter(accesses)
      )
      const query = queries.query(_conditions)

      const { rows } = await db.raw(query)
      if (rows) {
        const _chart = rows.map((row) => {
          return {
            name: row.fornecedor,
            y: Number(row.valor)
          }
        })
        return [chart, _chart]
      }
      return [chart, 0]
    })
  )
  const charts = Object.fromEntries(pairs)
  return {
    ...charts
  }
}
