export function getListRowsQuery({
  conditions = '',
  count = false,
  queryCollection,
  target
}) {
  const builder = queryCollection[target]
  return builder.listRows(conditions, count)
}
