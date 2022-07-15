import env from 'env-var'

const config = {
  engine: env
    .get('CYPHER_ENGINE')
    .default('bcrypt')
    .asString(),
  rounds: env
    .get('CYPHER_ROUNDS')
    .required()
    .asInt()
}

export default Object.freeze(config)
