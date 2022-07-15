import { makeAccessesFilterQuery, Sanitizer } from '@/Shared/Utils'
import { format } from 'date-fns'

export const QUERY_COLLECTION = {
  orders: {
    listRows: (conditions = '', count = false) =>
      `SELECT ${
        count
          ? 'count(distinct p.id) as total'
          : 'distinct p.id,* ,f.nome ,f.cnpj'
      } FROM pedidos p 
      INNER JOIN  fornecedores f 
        ON f.id = p.fornecedor_id
      ${conditions.includes('productcode') ?  
          ` INNER JOIN produtos pr
              ON pr.order_id = p.id `: ''}
      ${conditions.includes('invoice') ?  
          ` INNER JOIN notas_fiscais nf
              ON nf.rms_pedido = p.rms_pedido `: ''}
      ${conditions ? `AND ${conditions}` : ''}`,
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
    // isabrcertified  
  }
}