const makeSelectAndFromConditionsWiring = () => {
  return {
    query: `select n.nr_pedido  as orderNumber,
    n.nr_ordem_mistura as mixOrder ,
    n.nr_lote as batch,
    n.dt_producao as productionDate,
    n.nr_nf_venda as invoiceSale,
    n.dt_emissao_nf_venda as invoiceDate,
    n.cnpj_nf_venda as invoiceCNPJ,
    n.status_nf as invoiceStatus
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)`,
    group: `group by
    n.nr_pedido,
    n.nr_ordem_mistura,
    n.nr_lote,
    n.dt_producao,
    n.nr_nf_venda,
    n.dt_emissao_nf_venda,
    n.cnpj_nf_venda,
    n.status_nf `
  }
}

const makeSelectAndFromConditionsDetails = () => {
  return {
    query: `select 
    n.nr_pedido  as orderNumber,
    n.nr_ordem_mistura as mixOrder ,
    n.nr_lote as batch,
    p2.cnpj as weavingCNPJ
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)`,
    group: `group by
    n.nr_pedido,
    n.nr_ordem_mistura,
    n.nr_lote,
    p2.cnpj`
  }
}

const makeSelectAndFromConditionsCrop = () => {
  return {
    query: `select 
    null as crop,
    null as barcode,
    null as readingDate,
    null as invoiceOrigin,
    null as originCNPJ,
    null as receipt
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)
    join novelos_propriedades_fardos npf on npf.id_novelo in (n.id)
    join fardos f on f.id_safra  like (npf.fardos)`,
    group: `group by crop, barcode,readingDate,invoiceOrigin,originCNPJ,receipt`
  }
}

const makeSelectAndFromConditionsProduction = () => {
  return {
    query: `select 
    np.cod_barras as barcode,
    np.ncm as ncm,
    np.peso_kg as weight,
    np.peso_liq_kg as netWeight,
    np.tara_kg as tare
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)`,
    group: `group by
    np.cod_barras ,
    np.ncm,
    np.peso_kg,
    np.peso_liq_kg,
    np.tara_kg `
  }
}

const makeSelectAndFromConditionsChemical = () => {
  return {
    query: `select npq.ncm as ncm,
    npq.cnpj as chemicalCNPJ,
    npq.nr_nf as chemicalInvoice,
    npq.dt_emissao_nf as invoiceIssue,
    npq.nr_lote as batch,
    npq.marca as brand,
    null as unit,
    npq.quantidade as quantity,
    npq.conf_mrsl as confMRSL
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)
    join novelos_producao_quimicos npq on npq.id_novelos_producao in (np.id)`,
    group: `group by
    npq.ncm, 
    npq.cnpj,
    npq.nr_nf,
    npq.dt_emissao_nf,
    npq.nr_lote,
    npq.marca,
    npq.quantidade,
    npq.conf_mrsl`
  }
}
const makeSelectAndFromConditionsComposition = () => {
  return {
    query: `select 
    npc.ncm as ncm,
    npc.porcentagem as percent, 
    npc.descricao as description 
    from novelos_producao np 
    join novelos n on n.id in (np.id_novelo )
    join tecelagem_origem to2  on to2.cod_barras  in(np.cod_barras)
    join tecelagem t on t.id in (to2.id_lote)
    join tecelagem_producao tp on tp.id_lote  in (t.id )
    join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in (cp.id)
    join confeccao c on c.id in(cp.id_confeccao)
    join pedidos p on p.rms_pedido in (c.nr_pedido)
    join parceiros p2 on p2.author in (n.autor)
    join novelos_producao_composicoes npc on npc.id_novelos_producao in (np.id)`,
    group: `group by
    npc.ncm,
    npc.porcentagem,
    npc.descricao   `
  }
}

export const QUERY_COLLECTION_WEAVING = {
  Wiring: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWiring().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsWiring().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Details: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsDetails().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsDetails().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  Crop: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsCrop().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsCrop().group}`,
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
