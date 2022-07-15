const makeSelectAndFromConditionsProviders = () => {
  return `select 
  p.rms_pedido as orderNumber,
  c.status as orderStatus,
  p.data_atualizacao_pedido as lastUpdateOrder,
  c.dt_prev_entrega deliveryForecast,
  c.nr_ordem_producao as productionOrder, 
  c.nr_lote as batch,
  c.dt_producao as productionDate,
  c.nr_nf_venda as invoiceSale,
  c.dt_emissao_nf_venda as invoiceSaleDate
  from pedidos p  
  inner join confeccao c on c.nr_pedido = p.rms_pedido`
}

const makeSelectAndFromConditionsSpecificProvider = () => {
  return `select 
  p.rms_pedido as orderNumber,
  c.status as orderStatus,
  p2.cnpj as supplierCNPJ,
  p2.nome_parceiro as supplierName,
  c.nr_ordem_producao as productionOrder,
  c.nr_lote as batch
  from pedidos p  
  inner join confeccao c on c.nr_pedido = p.rms_pedido
  inner join parceiros p2 on p2.author in(c.autor)`
}
const makeSelectAndFromConditionsProduction = () => {
  return `select 
  distinct pi2.sku as itemCode,
  pi2.descricao as itemDescription,
  cp.nr_cup_inicial as initialCUP,
  cp.nr_cup_final as finalCUP
  from pedidos p  
  inner join confeccao c on c.nr_pedido in(p.rms_pedido)
  inner join pedidos_itens pi2 on pi2.id_pedido in (p.id)
  inner join confeccao_producao cp on cp.id_confeccao in(c.id)`
}

const makeSelectAndFromConditionsOutsources = () => {
  return {
    query: `select cnpj_subcontratado as outsourcesCNPJ,
    razao_social_subcontratado as outsourcesName,
    dt_solicitacao as requestDate,
    dt_prevista_termino finishForecast ,
    dt_termino finishDate, 
    sum(quantidade_entregue) as Total,
    un_medida as measure,
    atividade as activity,
    nr_nf as invoice,
    dt_emissao_nf as invoiceIssue
    from confeccao_producao_subcontratados cps
    inner join confeccao_producao cp on cp.id in(cps.id_confeccao_producao)
    inner join confeccao c on c.id in (cp.id_confeccao)
    inner join pedidos p on p.rms_pedido  in(c.nr_pedido)`,
    group: `group by cnpj_subcontratado,
    razao_social_subcontratado,
    dt_solicitacao,
    dt_prevista_termino,
    dt_termino, 
     un_medida ,
    atividade,
    nr_nf,
    dt_emissao_nf`
  }
}

const makeSelectAndFromConditionsTissue = () => {
  return {
    query: `select ct.cnpj_origem as confectionCnpj,
    ct.nr_nf_origem as originInvoiceNumber,
    ct.dt_emissao_nf as originInvoiceDate,
    ct.nr_lote_producao as productionBatch,
    ct.cod_barras as barcode
      from confeccao_producao_subcontratados cps
    inner join confeccao_producao cp on cp.id in(cps.id_confeccao_producao)
    inner join confeccao c on c.id in (cp.id_confeccao)
    inner join pedidos p on p.rms_pedido  in(c.nr_pedido)
    inner join confeccao_tecido ct on ct.id_confeccao_producao in (cp.id)`,
    group: `group by ct.cnpj_origem,
    ct.nr_nf_origem,
    ct.dt_emissao_nf,
    ct.nr_lote_producao,
    ct.cod_barras`
  }
}

const makeSelectAndFromConditionsChemical = () => {
  return {
    query: `select ctq.ncm as ncm,
    ctq.cnpj as chemicalCNPJ,
    ctq.nr_nf as invoiceNumber,
    ctq.dt_emissao_nf as InvoiceIssue,
    ctq.nr_lote as batch,
    ctq.marca as brand,
    ctq.un as measure,
    ctq.quantidade as total,
    ctq.conf_mrsl as confMRSL
      from confeccao_producao_subcontratados cps
    inner join confeccao_producao cp on cp.id in(cps.id_confeccao_producao)
    inner join confeccao c on c.id in (cp.id_confeccao)
    inner join pedidos p on p.rms_pedido  in(c.nr_pedido)
    inner join confeccao_tecido ct on ct.id_confeccao_producao in (cp.id)
    inner join confeccao_tecido_quimico ctq on ctq.confeccao_tecido_id in(ct.id)`,
    group: `group by ctq.ncm,
    ctq.cnpj,
    ctq.nr_nf,
    ctq.dt_emissao_nf,
    ctq.nr_lote,
    ctq.marca,
    ctq.un,
    ctq.quantidade,
    ctq.conf_mrsl`
  }
}

export const QUERY_COLLECTION_SUPPLIER = {
  Providers: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsProviders()}
      ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  SpecificProvider: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSpecificProvider()}
        ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Production: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsProduction()}
        ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Outsources: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsOutsources().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsOutsources().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Tissue: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsTissue().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsTissue().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Chemical: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsChemical().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsChemical().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  }
}
