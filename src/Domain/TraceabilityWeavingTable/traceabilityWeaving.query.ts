const makeSelectAndFromConditionsWeaving = () => {
  return {
    query: `select t.nr_pedido as orderNumber,
    t.nr_ordem_producao as productionOrder,
    t.nr_lote as batch,
    t.dt_producao as productionDate,
    t.nr_nf_venda as invoiceSale,
    t.dt_emissao_nf_venda as invoiceIssue,
    t.cnpj_confeccao as confecction,
    t.status_nf as InvoiceStatus from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)`,
    group: `group by t.nr_pedido,
    t.nr_ordem_producao,
    t.nr_lote,
    t.dt_producao,
    t.nr_nf_venda,
    t.dt_emissao_nf_venda,
    t.cnpj_confeccao,
    t.status_nf`
  }
}

const makeSelectAndFromConditionsDetails = () => {
  return {
    query: `select t.nr_pedido as orderNumber,
    t.nr_ordem_producao as productionOrder,
    t.nr_lote as batch,
    p2.cnpj as WeavingCNPJ,
    ct.cnpj_origem as supplierCNPJ
    from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)`,
    group: `group by t.nr_pedido,
    t.nr_ordem_producao,
    t.nr_lote,
    t.dt_emissao_nf_venda,
    p2.cnpj,
    ct.cnpj_origem`
  }
}

const makeSelectAndFromConditionsOriginLine = () => {
  return {
    query: `select 
    to2.cnpj_origem as supplierCNPJ,
    to2.nr_nf_origem  as invoiceOrigin,
    to2.dt_emissao_nf  as invoiceDate,
    to2.nr_lote_producao  as productionBatch,
    to2.cod_barras  as barcodes,
    to2.ncm as ncm,
    to2.peso_kg as weight
    from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)
    join tecelagem_origem to2 on to2.id_lote in (t.id)`,
    group: `group by 
    to2.cnpj_origem,
    to2.nr_nf_origem,
    to2.dt_emissao_nf,
    to2.nr_lote_producao,
    to2.cod_barras,
    to2.ncm,
    to2.peso_kg `
  }
}

const makeSelectAndFromConditionsProduction = () => {
  return {
    query: `select 
    tp.cod_barras as barcodes,
    tp.ncm as ncm,
    tp.peso_kg as weight,
    tp.peso_liq_kg as netWeight,
    tp.tara_kg as tare
    from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)
    join tecelagem_origem to2 on to2.id_lote in (t.id)`,
    group: `group by 
    tp.cod_barras,
    tp.ncm,
    tp.peso_kg,
    tp.peso_liq_kg,
    tp.tara_kg`
  }
}

const makeSelectAndFromConditionsChemical = () => {
  return {
    query: `select
    tpq.ncm as ncm,
    tpq.cnpj as chemicalCNPJ,
    tpq.nr_nf as chemicalInvoice,
    tpq.dt_emissao_nf as invoiceIssue,
    tpq.nr_lote as chemicalBatch,
    tpq.marca as brand,
    tpq.un as unit,
    tpq.quantidade as quantity,
    tpq.conf_mrsl as confMRSL 
    from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)
    join tecelagem_origem to2 on to2.id_lote in (t.id)
    join tecelagem_producao_quimicos tpq on tpq.id_lotes_tecelagem_producao in (tp.id)`,
    group: `group by 
    tpq.ncm,
    tpq.cnpj,
    tpq.nr_nf,
    tpq.dt_emissao_nf,
    tpq.nr_lote,
    tpq.marca,
    tpq.un ,
    tpq.quantidade,
    tpq.conf_mrsl `
  }
}
const makeSelectAndFromConditionsComposition = () => {
  return {
    query: `select 
    tpc.ncm as ncm,
    tpc.porcentagem as percent,
    tpc.descricao as description
    from tecelagem_producao tp 
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join tecelagem t on t.id in (tp.id_lote)
    join parceiros p2 on p2.author in (t.autor)
    join tecelagem_origem to2 on to2.id_lote in (t.id)
    join tecelagem_producao_composicao tpc on tpc.id_lotes_tecelagem_producao in (tp.id )`,
    group: `group by 
    tpc.ncm,
    tpc.porcentagem,
    tpc.descricao `
  }
}

export const QUERY_COLLECTION_WEAVING = {
  Weaving: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWeaving().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsWeaving().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Details: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsDetails().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsDetails().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  OrigenLine: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsOriginLine().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsOriginLine().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Production: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsProduction().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsProduction().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Chemical: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsChemical().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsChemical().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Composition: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsComposition().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsComposition().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  }
}
