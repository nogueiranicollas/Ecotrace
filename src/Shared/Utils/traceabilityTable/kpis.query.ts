import { makeAccessesFilterQuery, Sanitizer } from '..'
import { format } from 'date-fns'

const makeSelectAndFromConditions = (conditions: string) => {
  if (
    conditions.includes('lp.faz_cidade = c."name" AND lp.faz_estado = c.uf')
  ) {
    return `SELECT DISTINCT lp.faz_car, c."name", c.latitude, c.longitude, c.id as city_id FROM lista_propriedades lp, cities c`
  }

  return `SELECT COUNT(DISTINCT lp.faz_car) FROM lista_propriedades lp`
}

export const QUERY_COLLECTION = {
  kpis: {
    totalOrders: {
      query: (conditions = '') =>
        `SELECT count(p.id) as count FROM pedidos p 
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
      ${conditions ? `AND ${conditions}` : ''} `,
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
    },
    deliveredOrders: {
      query: (conditions = '') =>
        `SELECT count(p.id) as count FROM pedidos p 
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
      ${conditions ? `AND ${conditions}` : ''} `,
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
    },
    openOrders: {
      query: (conditions = '') =>
        `SELECT count(p.id) as count FROM pedidos p 
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
      ${conditions ? `AND ${conditions}` : ''} `,
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
    },
    delayedOrders: {
      query: (conditions = '') =>
        `SELECT count(p.id) as count FROM pedidos p 
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
        ${conditions ? `AND ${conditions}` : ''} `,
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
