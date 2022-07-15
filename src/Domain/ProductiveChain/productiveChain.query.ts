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

const makeSelectAndFromConditionsOrderSummary = (conditions: string) => {
  
  return `select distinct p.id as id_pedido, p.rms_pedido as orderNumber, p.data_inicial_agendamento as orderDate, null as qtyTotal, null as qtyDelivered, null as orderStatus, null as orderSituation, f.cnpj as supplierCnpj, f.nome as supplierName, null as orderItens
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)`

}

const makeSelectAndFromConditionsOrderItens = (conditions: string) => {
  
  return `select distinct pi2.sku as itemCode, pi2.descricao as itemDescription, cp.qtde_sku as itemQtyTotal, cp.qtde_sku as itemQtyDelivered
  from pedidos_itens pi2
  inner join pedidos p on p.id = pi2.id_pedido 
  inner join confeccao c2 on c2.nr_pedido = p.rms_pedido
  inner join confeccao_producao cp on cp.id_confeccao = c2.id`

}

const makeSelectAndFromConditionsRetail = (conditions: string) => {
  
  return `select distinct p.id as id_pedido, p.rms_pedido as orderNumber, nf.chave as orderInvoice, null as qtyItensOrder, nf.destino_cpf_cnpj as retailCnpj, nf.destino_nome_razaosocial as retailName, null as retailAddress, null as retailCity, null as retailLatitude, null as retailLongitude
  from pedidos p
  inner join notas_fiscais nf on nf.rms_pedido IN(p.rms_pedido)`

}

const makeSelectAndFromConditionsProvider = (conditions: string) => {
  
  return `select distinct p.id as id_pedido, p.rms_pedido as orderNumber, c.nr_ordem_producao  as opNumber, c.nr_lote as batchNumber, f.cnpj as providerCnpj, null as providerAddress, null as providerCity, null as providerLatitude, null as providerLongitude, null as providerCertificationsAbbreviations, null as providerCertifications, null as providerOutsource 
  from pedidos p
  inner join confeccao c on c.nr_pedido = p.rms_pedido 
  inner join fornecedores f on f.id = p.fornecedor_id`

}

const makeSelectAndFromConditionsProviderOutsource = (conditions: string) => {
  
  return `select distinct p.id as id_pedido, p.rms_pedido as orderNumber, cps.dt_solicitacao as requestDate, cps.nr_nf as invoice, cps.cnpj_subcontratado as outsourceCnpj, cps.razao_social_subcontratado as outsourceName, null as outsourceAddress, null as outsourceCity, null as outsourceLatitude, null as outsourceLongitude
  from pedidos p
  inner join confeccao c on c.nr_pedido = p.rms_pedido 
  inner join confeccao_producao cp2 on cp2.id_confeccao = c.id 
  inner join confeccao_producao_subcontratados cps on cps.id_confeccao_producao = cp2.id`

}

const makeSelectAndFromConditionsWeaving = (conditions: string) => {
  
  return `SELECT distinct p.rms_pedido as orderNumber, c.nr_ordem_producao as opNumber, ct.nr_lote_producao as batchNumber, ct.cnpj_origem  as weavingCnpj, null as weavingAddress, null as weavingCity, null as weavingLatitude, null as weavingLongitude
  FROM pedidos p
  inner join confeccao c on c.nr_pedido = p.rms_pedido 
  inner join pedidos_itens pi2 on pi2.id_pedido = p.id
  inner join confeccao_producao cp on cp.sku = pi2.sku and cp.id_confeccao = c.id 
  inner join confeccao_tecido ct on ct.id_confeccao_producao = cp.id 
  inner join tecelagem_producao tp on tp.cod_barras = ct.cod_barras`

}

const makeSelectAndFromConditionsWiring = (conditions: string) => {
  
  return `SELECT distinct p.rms_pedido as orderNumber, c.nr_ordem_producao  as opNumber, to3.nr_lote_producao  as batchNumber, to3.cnpj_origem as wiringCnpj, null as wiringAddress, null as wiringCity, null as wiringLatitude, null as wiringLongitude
  FROM pedidos p
  inner join confeccao c on c.nr_pedido = p.rms_pedido 
  inner join pedidos_itens pi2 on pi2.id_pedido = p.id
  inner join confeccao_producao cp on cp.sku = pi2.sku and cp.id_confeccao = c.id 
  inner join confeccao_tecido ct on ct.id_confeccao_producao = cp.id 
  inner join tecelagem_producao tp on tp.cod_barras = ct.cod_barras
  inner join tecelagem_origem to3 on to3.id_lote = tp.id_lote 
  inner join novelos_producao np on np.cod_barras = to3.cod_barras`

}

const makeSelectAndFromConditionsProperty = (conditions: string) => {
  
  return `SELECT distinct p.rms_pedido as orderNumber, c.nr_ordem_producao as opNumber, to3.nr_lote_producao as batchNumber, npf.faz_car as propertyCnpj, npf.endereco as propertyAddress, npf.cidade as propertyCity, npf.geo_latitude  as propertyLatitude, npf.geo_longitude as propertyLongitude
  FROM pedidos p
  inner join confeccao c on c.nr_pedido = p.rms_pedido 
  inner join pedidos_itens pi2 on pi2.id_pedido = p.id
  inner join confeccao_producao cp on cp.sku = pi2.sku and cp.id_confeccao = c.id 
  inner join confeccao_tecido ct on ct.id_confeccao_producao = cp.id 
  inner join tecelagem_producao tp on tp.cod_barras = ct.cod_barras
  inner join tecelagem_origem to3 on to3.id_lote = tp.id_lote 
  inner join novelos_producao np on np.cod_barras = to3.cod_barras 
  inner join novelos_propriedades_fardos npf on npf.id_novelo = np.id_novelo`

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

export const QUERY_COLLECTION_PRODUCTIVE_CHAIN = {
  orderSummary: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsOrderSummary(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  orderItens: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsOrderItens(conditions)}
        ${
          conditions
            ? `WHERE pi2.sku = cp.sku 
            AND ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  retail: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsRetail(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  provider: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsProvider(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  providerOutsource: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsProviderOutsource(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  weaving: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsWeaving(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  wiring: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsWiring(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
  property: {
    listRows: (conditions = '', count = false) =>
      `${makeSelectAndFromConditionsProperty(conditions)}
        ${
          conditions
            ? `WHERE ${conditions}`
            : ''
        }`,
        orderNumber: (param) => `p.rms_pedido = '${param}'`,
  },
}
