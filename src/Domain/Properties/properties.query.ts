import { Sanitizer } from '@/Shared/Utils'

const makeSelectAndFromConditions = (conditions: string, isCount: boolean) => {
  if (
    conditions.includes('lp.faz_cidade = c."name" AND lp.faz_estado = c.uf') &&
    !isCount
  ) {
    return `SELECT DISTINCT lp.faz_car, c."name" as city_name, c.latitude, c.longitude, c.id as city_id
      FROM lista_propriedades lp, lista_caixas lc, caixas_lotes cl, cities c`
  }

  if (isCount) {
    return 'SELECT count(distinct lp.id) as total FROM lista_propriedades lp, lista_caixas lc, caixas_lotes cl'
  }

  if (conditions) {
    return 'SELECT DISTINCT lp.* FROM lista_propriedades lp, lista_caixas lc, caixas_lotes cl'
  }

  return ''
}

export const QUERY_COLLECTION = {
  properties: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditions(conditions, count)}
        ${
          conditions
            ? `WHERE lp.chave = lc.chave
        AND lp.nr_lote_abate = cl.nr_lote_abate 
        AND lc.codigo_barras = cl.codigo_barras 
        AND ${conditions}`
            : ''
        }`,
    accessesFilter: (_) => '',
    // Object.keys(accesses).length
    // ? `lp.chave IN (SELECT chave FROM pedidos p WHERE ${makeAccessesFilterQuery(
    //     accesses
    //   )})`
    // : '',
    slaughtersif: (param) =>
      `lp.chave = lc.chave AND lp.nr_unidade_abate = '${param}'`,
    boningoutinspectionnum: (param) =>
      `lp.chave = lc.chave AND sif_producao = '${param}'`,
    barcode: (param) =>
      `lp.chave = lc.chave AND lc.codigo_barras = '${param}'
      AND lp.dt_abate = lc.dt_abate`,
    order: (param) => `lp.nr_pedido = '${param}'`,
    cargo: (param) => `lp.nr_carga = '${param}'`,
    batch: (param) => `lp.chave = lc.chave and lc.nr_op_desossa = '${param}'`,
    car: (param) => `faz_car LIKE '%${param}%'`,
    producerdoc: (param) => `prod_cpf_cnpj LIKE '%${param}%'`,
    ie: (param) => `prod_nr_ie LIKE '%${param}%'`,
    propname: (param) => `UPPER(faz_nome) LIKE '%${param.toUpperCase()}%'`,
    producername: (param) =>
      `UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%'`,
    destinationcnpj: (param) =>
      `lp.chave IN (SELECT chave FROM pedidos WHERE nf_cnpj_destino LIKE '%${param}%')`,
    slaughteredat: (param) =>
      `lp.chave = lc.chave and lp.dt_abate BETWEEN '${param[0]}' AND '${param[1]}'`,
    boningoutat: (param) =>
      `lp.chave = lc.chave AND lc.dt_producao BETWEEN '${param[0]}' AND '${param[1]}'`,
    expiresat: (param) =>
      `lp.chave = lc.chave AND lc.dt_validade BETWEEN '${param[0]}' AND '${param[1]}'`,
    orderedat: (param) =>
      `lp.chave IN (SELECT chave FROM pedidos WHERE dt_venda BETWEEN '${param[0]}' AND '${param[1]}')`,
    invoice: (param) =>
      `lp.chave IN (SELECT chave FROM pedidos WHERE nf_numero = '${param}')`,
    invoiceat: (param) =>
      `lp.chave IN (SELECT chave FROM pedidos WHERE dt_emissao_nf BETWEEN '${param[0]}' AND '${param[1]}')`,
    orderskeys: (param) =>
      `lp.chave IN (${param.split(',').map((each) => `'${each}'`)})`,
    stockcnpj: (param) =>
      `lp.chave IN (SELECT chave FROM pedidos WHERE cnpj_local_estoque = '${Sanitizer.CNPJ(
        param
      )}')`,
    locations: () => `lp.faz_cidade = c."name" AND lp.faz_estado = c.uf`
  }
}
