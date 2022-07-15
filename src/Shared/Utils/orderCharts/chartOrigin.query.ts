import { makeAccessesFilterQuery, Sanitizer } from '..'
import { format } from 'date-fns'

function initialSql() {
  return `SELECT count(p.id) as valor, p.origem_pedido AS origem`
}

function finalSql() {
  return 'GROUP BY origem ORDER BY valor DESC LIMIT 10'
}

export const QUERY_COLLECTION = {
  charts: {
    orderByOrigin: {
      query: (conditions = '') =>
        `${initialSql()}         
        FROM
        pedidos p 
        INNER JOIN  fornecedores f 
        ON f.id = p.fornecedor_id
      ${
        conditions.includes('productcode')
          ? ` INNER JOIN produtos pr
              ON pr.order_id = p.id `
          : ''
      }
      ${
        conditions.includes('invoice')
          ? ` INNER JOIN notas_fiscais nf
              ON nf.rms_pedido = p.rms_pedido `
          : ''
      }
      ${conditions ? `AND ${conditions}` : ''} ${finalSql()}`,
      accessesFilter: makeAccessesFilterQuery,
      productcode: (param) => `pr.sku = '${param}'`,
      originsupplier: (param) => `p.origem_pedido = '${param}'`,
      orderstatus: (param) => `p.status = '${param}'`,
      invoice: (param) => `nf.numero = '${param}'`,
      ordernumber: (param) => `p.rms_pedido = '${param}'`,
      confectioncnpj: (param) => `f.cnpj = '${Sanitizer.CNPJ(param)}'`,
      datestart: (param) =>
        `p.data_registro_pedido >= '${format(param, 'yyyy-MM-dd')}' ::date `,
      dateend: (param) =>
        `p.data_registro_pedido <= '${format(param, 'yyyy-MM-dd')}' ::date `
    }
  }
}
