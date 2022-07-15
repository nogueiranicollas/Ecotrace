export async function countList(db, query) {
  console.log('\nPAGINATION QUERY >>', query)
  const { rows } = await db.raw(query)
  return Number(rows[0].total)
}
