export async function fetchList(db, params, query, Wrapper) {
  const { limit, page, column, direction } = params
  const order = `order by ${column} ${direction}`
  const offset = `offset ${page} * ${limit}`
  const _limit = `limit ${limit}`

  let executeQuery = `${query} ${order} ${offset} ${_limit}`
  if (params.locations) executeQuery = query

  console.log(`\nFETCH QUERY >> ${executeQuery}\n`)
  const { rows } = await db.raw(executeQuery)

  if (params.locations) return rows
  return rows.map((e) => new Wrapper(e).toJSON())
}

export async function fetchListTeste(db, params, query) {
  const { limit, page, column, direction } = params
  const order = `order by ${column} ${direction}`
  const offset = `offset ${page} * ${limit}`
  const _limit = `limit ${limit}`

  let executeQuery = `${query} ${order} ${offset} ${_limit}`
  if (params.locations) executeQuery = query

  console.log(`\nFETCH QUERY >> ${executeQuery}\n`)
  const { rows } = await db.raw(executeQuery)

  return rows
  // return rows.map((e) => new Wrapper(e).toJSON())
}

export async function fetchListWithoutPagination(db, params, query) {
  const { column, direction } = params
  const order = `order by ${column} ${direction}`

  let executeQuery = `${query} ${order}`
  if (params.locations) executeQuery = query

  console.log(`\nFETCH QUERY >> ${executeQuery}\n`)
  const { rows } = await db.raw(executeQuery)

  return rows
  // return rows.map((e) => new Wrapper(e).toJSON())
}
export async function fetchListWithLimit(db, params, query) {
  const { limit, column, direction } = params
  const order = `order by ${column} ${direction}`
  const _limit = `limit ${limit}`

  let executeQuery = `${query} ${order}  ${_limit}`
  if (params.locations) executeQuery = query

  console.log(`\nFETCH QUERY >> ${executeQuery}\n`)
  const { rows } = await db.raw(executeQuery)

  return rows
  // return rows.map((e) => new Wrapper(e).toJSON())
}
