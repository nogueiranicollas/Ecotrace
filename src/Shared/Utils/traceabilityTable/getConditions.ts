export function getConditions({ params, queryCollection, target }) {
  if (!Object.keys(queryCollection).includes(target)) return ''
  const queries = queryCollection[target]
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
  return conditions.join(' AND ').trim()
}
