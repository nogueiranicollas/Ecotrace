import { makeAccessesFilterQuery, Sanitizer } from '..'

const makeSelectAndFromConditionsSupplyer = (conditions: string) => {
  return `select p.origem_pedido as "country" , count(p.rms_pedido) as "orders" ,
  SUM(p.qtd_total ) as "volumes" from pedidos p group by p.origem_pedido order by count(p.rms_pedido) desc  limit 10 `
}

function initialSql(date) {
  return `SELECT
  extract(month from ${date}),
  case to_char(${date},'MM') 
  when '01' then 'jan'
  when '02' then 'fev'
  when '03' then 'mar'
  when '04' then 'abr'
  when '05' then 'mai'
  when '06' then 'jun'
  when '07' then 'jul'
  when '08' then 'ago'
  when '09' then 'set'
  when '10' then 'out'
  when '11' then 'nov'
  when '12' then 'dez'
  else 'not found'
  end as mes`
}

function finalSql(date) {
  return `group by extract(month from ${date}), mes order by 1 asc`
}

export const QUERY_COLLECTION = {
  charts: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsSupplyer(conditions)}
      ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`,
    ordersBySupplier: {
      query: (conditions = '') => `${makeSelectAndFromConditionsSupplyer(
        conditions
      )}
      ${conditions ? `WHERE ${conditions}` : ''}`,
      orderNumber: (param) => `p.rms_pedido = '${param}'`
    },
    ordersDeliveredXOpenByMonth: {
      query: (conditions = '') => `${makeSelectAndFromConditionsSupplyer(
        conditions
      )}
      ${conditions ? `WHERE ${conditions}` : ''}`,
      orderNumber: (param) => `p.rms_pedido = '${param}'`
    },
    orderByOrigin: {
      query: (conditions = '') => `${makeSelectAndFromConditionsSupplyer(
        conditions
      )}
      ${conditions ? `WHERE ${conditions}` : ''}`,
      orderNumber: (param) => `p.rms_pedido = '${param}'`
    }
    // ,
    // invoicesByMonth: {
    //   query: (conditions = '') =>
    //     `${initialSql('dt_emissao_nf')},
    //     count(chave) as valor
    //     FROM
    //     pedidos p ${conditions ? `WHERE ${conditions}` : ''} ${finalSql(
    //       'dt_emissao_nf'
    //     )}`,
    //   accessesFilter: makeAccessesFilterQuery,
    //   slaughtersif: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE sif_abate LIKE '%${param}%')`,
    //   boningoutinspectionnum: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE sif_producao LIKE '%${param}%')`,
    //   barcode: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE codigo_barras LIKE '%${param}%')`,
    //   order: (param) => `p.id = '${param}'`,
    //   cargo: (param) => `p.nr_carga = '${param}'`,
    //   batch: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE nr_op_desossa = '${param}')`,
    //   car: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE faz_car LIKE '%${param}%')`,
    //   producerdoc: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_cpf_cnpj LIKE '%${param}%')`,
    //   ie: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_nr_ie LIKE '%${param}%')`,
    //   propname: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(faz_nome) LIKE '%${param.toUpperCase()}%')`,
    //   producername: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%')`,
    //   destinationcnpj: (param) => `nf_cnpj_destino LIKE '%${param}%'`,
    //   slaughteredat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_abate BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   boningoutat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_producao BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   expiresat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_validade BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   orderedat: (param) => `dt_venda BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   trackable: (param) => `rastreavel = ${param}`,
    //   invoice: (param) => `nf_numero LIKE '%${param}%'`,
    //   invoiceat: (param) =>
    //     `dt_emissao_nf BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   stockcnpj: (param) => `p.cnpj_local_estoque = '${Sanitizer.CNPJ(param)}'`
    // },
    // trackedTonsByMonth: {
    //   query: (conditions = '') =>
    //     `${initialSql('dt_emissao_nf')},
    //     sum(peso_liquido) as valor
    //     FROM
    //     pedidos p, lista_caixas lc
    //     WHERE  p.chave  = lc.chave
    //     ${conditions ? `AND ${conditions}` : ''} ${finalSql('dt_emissao_nf')}`,
    //   accessesFilter: makeAccessesFilterQuery,
    //   slaughtersif: (param) => `sif_abate LIKE '%${param}%'`,
    //   boningoutinspectionnum: (param) => `sif_producao LIKE '%${param}%'`,
    //   barcode: (param) => `codigo_barras LIKE '%${param}%'`,
    //   order: (param) => `p.id = '${param}'`,
    //   cargo: (param) => `p.nr_carga = '${param}'`,
    //   batch: (param) => `nr_op_desossa = '${param}'`,
    //   car: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE faz_car LIKE '%${param}%')`,
    //   producerdoc: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_cpf_cnpj LIKE '%${param}%')`,
    //   ie: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_nr_ie LIKE '%${param}%')`,
    //   propname: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(faz_nome) LIKE '%${param.toUpperCase()}%')`,
    //   producername: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%')`,
    //   destinationcnpj: (param) => `nf_cnpj_destino LIKE '%${param}%'`,
    //   slaughteredat: (param) =>
    //     `dt_abate BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   boningoutat: (param) =>
    //     `dt_producao BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   expiresat: (param) =>
    //     `dt_validade BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   orderedat: (param) => `dt_venda BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   trackable: (param) => `rastreavel = ${param}`,
    //   invoice: (param) => `nf_numero LIKE '%${param}%'`,
    //   invoiceat: (param) =>
    //     `dt_emissao_nf BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   stockcnpj: (param) => `p.cnpj_local_estoque = '${Sanitizer.CNPJ(param)}'`
    // },
    // propertiesByMonth: {
    //   query: (conditions = '') =>
    //     `${initialSql('lp.dt_abate')},
    //     count(distinct lp.nr_unidade_abate+lp.prod_cpf_cnpj) as valor
    //     FROM
    //     pedidos p, lista_propriedades lp
    //     WHERE  p.chave = lp.chave
    //     ${conditions ? `AND ${conditions}` : ''} ${finalSql('lp.dt_abate')}`,
    //   accessesFilter: makeAccessesFilterQuery,
    //   slaughtersif: (param) => `lp.nr_unidade_abate = '${param}'`,
    //   boningoutinspectionnum: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE sif_producao LIKE '%${param}%')`,
    //   barcode: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE codigo_barras LIKE '%${param}%')`,
    //   order: (param) => `p.id = '${param}'`,
    //   cargo: (param) => `p.nr_carga = '${param}'`,
    //   batch: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE nr_op_desossa = '${param}')`,
    //   car: (param) => `faz_car LIKE '%${param}%'`,
    //   producerdoc: (param) => `prod_cpf_cnpj LIKE '%${param}%'`,
    //   ie: (param) => `prod_nr_ie LIKE '%${param}%'`,
    //   propname: (param) => `UPPER(faz_nome) LIKE '%${param.toUpperCase()}%'`,
    //   producername: (param) =>
    //     `UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%'`,
    //   destinationcnpj: (param) => `nf_cnpj_destino LIKE '%${param}%'`,
    //   slaughteredat: (param) =>
    //     `lp.dt_abate BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   boningoutat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_producao BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   expiresat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_validade BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   orderedat: (param) => `dt_venda BETWEEN '${param[0]}' AND '${param[1]}'}`,
    //   trackable: (param) => `rastreavel = ${param}`,
    //   invoice: (param) => `nf_numero LIKE '%${param}%'`,
    //   invoiceat: (param) =>
    //     `lp.dt_abate BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   stockcnpj: (param) => `p.cnpj_local_estoque = '${Sanitizer.CNPJ(param)}'`
    // },
    // volumeDeliveredByMonth: {
    //   query: (conditions = '') =>
    //     `${initialSql('dt_emissao_nf')},
    //     sum(quantidade) as valor
    //     FROM
    //     pedidos p
    //     ${conditions ? `WHERE ${conditions}` : ''} ${finalSql(
    //       'dt_emissao_nf'
    //     )}`,
    //   accessesFilter: makeAccessesFilterQuery,
    //   slaughtersif: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE sif_abate LIKE '%${param}%')`,
    //   boningoutinspectionnum: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE sif_producao LIKE '%${param}%')`,
    //   barcode: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE codigo_barras LIKE '%${param}%')`,
    //   order: (param) => `p.id = '${param}'`,
    //   cargo: (param) => `p.nr_carga = '${param}'`,
    //   batch: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE nr_op_desossa = '${param}')`,
    //   car: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE faz_car LIKE '%${param}%')`,
    //   producerdoc: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_cpf_cnpj LIKE '%${param}%')`,
    //   ie: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE prod_nr_ie LIKE '%${param}%')`,
    //   propname: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(faz_nome) LIKE '%${param.toUpperCase()}%')`,
    //   producername: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_propriedades WHERE UPPER(prod_nome_razaosocial) LIKE '%${param.toUpperCase()}%')`,
    //   destinationcnpj: (param) => `nf_cnpj_destino LIKE '%${param}%'`,
    //   slaughteredat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_abate BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   boningoutat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_producao BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   expiresat: (param) =>
    //     `p.chave IN (SELECT chave FROM lista_caixas WHERE dt_validade BETWEEN '${param[0]}' AND '${param[1]}')`,
    //   orderedat: (param) => `dt_venda BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   trackable: (param) => `rastreavel = ${param}`,
    //   invoice: (param) => `nf_numero LIKE '%${param}%'`,
    //   invoiceat: (param) =>
    //     `dt_emissao_nf BETWEEN '${param[0]}' AND '${param[1]}'`,
    //   stockcnpj: (param) => `p.cnpj_local_estoque = '${Sanitizer.CNPJ(param)}'`
    // }
  }
}
