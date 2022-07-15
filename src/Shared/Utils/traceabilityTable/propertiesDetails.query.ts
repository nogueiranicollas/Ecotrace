import { makeAccessesFilterQuery, Sanitizer } from '..'

export const QUERY_COLLECTION = {
  propertiesDetailsKpi: {
    query: (conditions = '') =>
      `SELECT distinct (lp.faz_car), 
        lp.prod_nome_razaosocial, 
        lp.faz_nome, 
        lp.faz_lat, 
        lp.faz_lng, 
        lp.faz_cidade, 
        lp.faz_estado, 
        lp.nr_unidade_abate 
      FROM proprierties lp 
      INNER JOIN pedidos p 
      ON p.chave = lp.chave ${conditions ? `AND ${conditions}` : ''}`,
    listRows: (conditions = '', count = false) =>
      `SELECT ${
        count
          ? 'count(distinct lp.faz_car) as total'
          : 'distinct (lp.faz_car), lp.prod_nome_razaosocial, lp.faz_nome, lp.faz_lat, lp.faz_lng, lp.faz_cidade, lp.faz_estado, lp.nr_unidade_abate '
      } FROM proprierties lp 
        INNER JOIN pedidos p 
        ON p.chave = lp.chave ${conditions ? `AND ${conditions}` : ''}`,
    accessesFilter: makeAccessesFilterQuery,
    slaughtersif: (param) => `lp.nr_unidade_abate = '${param}'`,
    boningoutinspectionnum: (param) =>
      `lp.chave IN (SELECT chave FROM lista_caixas WHERE sif_producao LIKE '%${param}%')`,
    barcode: (param) =>
      `lp.chave IN (SELECT chave FROM lista_caixas WHERE codigo_barras LIKE '%${param}%')`,
    order: (param) => `lp.id = '${param}'`,
    cargo: (param) => `lp.nr_carga = '${param}'`,
    batch: (param) =>
      `lp.chave IN (SELECT chave FROM lista_caixas WHERE nr_op_desossa = '${param}')`,
    car: (param) => `lp.faz_car LIKE '%${param}%'`,
    producerdoc: (param) => `prod_cpf_cnpj LIKE '%${param}%'`,
    ie: (param) => `lp.prod_nr_ie LIKE '%${param}%'`,
    propname: (param) => `UPPER(lp.faz_nome) LIKE '%${param.toUpperCase()}%'`,
    producername: (param) =>
      `UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%'`,
    destinationcnpj: (param) => `p.nf_cnpj_destino LIKE '%${param}%' `,
    slaughteredat: (param) =>
      `lp.chave IN (SELECT chave FROM lista_caixas WHERE dt_abate BETWEEN '${param[0]}' AND '${param[1]}')`,
    boningoutat: (param) =>
      `lp.chave IN (SELECT chave FROM lista_caixas WHERE dt_producao BETWEEN '${param[0]}' AND '${param[1]}')`,
    expiresat: (param) =>
      `p.dt_validade BETWEEN '${param[0]}' AND '${param[1]}' `,
    orderedat: (param) => `p.dt_venda BETWEEN '${param[0]}' AND '${param[1]}' `,
    trackable: (param) => `p.rastreavel = ${param} `,
    invoice: (param) => `p.nf_numero LIKE '%${param}%' `,
    invoiceat: (param) =>
      `p.dt_emissao_nf BETWEEN '${param[0]}' AND '${param[1]}' `,
    stockcnpj: (param) => `p.cnpj_local_estoque = '${Sanitizer.CNPJ(param)}' `
  }
}
