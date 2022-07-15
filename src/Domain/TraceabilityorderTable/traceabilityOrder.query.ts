const makeSelectAndFromConditionsOrders = () => {
  return `select 
  distinct p.rms_pedido as orderNumber,
  p.data_inicial_agendamento as orderDate,
  f.cnpj as supplierCnpj,
  f.nome as supplierName,
  p.qtd_total as qtyTotal,
  null as supplierOrigin,
  p.status_pedido as orderStatus,
  c.status as orderSituation
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)`
}

const makeSelectAndFromConditionsSpecificOrder = () => {
  return `select 
  distinct p.rms_pedido as orderNumber,
  p.data_inicial_agendamento as orderDate,
  pi2.sku as itemCode,
  pi2.descricao itemDescription,
  p.qtd_total as qtyTotal,
  null as qtyDelivery,
  f.cnpj as suppliercnpj,
  f.nome as supplierName,
  p.status_pedido as orderStatus,
  c.status as orderSituation
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)
  inner join confeccao_producao_subcontratados cps on cps.id_confeccao_producao = cp.id`
}

const makeSelectAndFromConditionsDetails = () => {
  return {
    query: `select
  distinct case
  	when npf.certificado_abr is null then 'no' else 'yes' 
  end as certifierAbr,
  pi2.sku as itemCode,
  nf.numero as invoiceNumber,
  nf.dt_emissao as invoiceDate,
  nf.natureza as invoiceNature,
  pi2.descricao as itemDescription,
  pi2.material_descricao as materialType,
  d.nome as department,
  p.qtd_total as qtyTotal,
  c.dt_prev_entrega,
  piad.created_at,
  null as supplierOrigin,
  c.status as orderSituation
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)
  inner join confeccao_producao_subcontratados cps on cps.id_confeccao_producao in(cp.id)
  inner join notas_fiscais nf on nf.rms_pedido  IN(p.rms_pedido)
  inner join parceiros p2  on p2.author  IN(c.autor)
  inner join tecelagem t  on t.cnpj_confeccao IN(p2.cnpj)
  inner join novelos n on n.autor in (t.autor)
  inner join novelos_propriedades_fardos npf on npf.id_novelo in(n.id)
  inner join departamentos d on d.id = pi2.departamento_id
  inner join pedidos_itens_armazens_departamentos piad on piad.pedido_item_id in( pi2.id)`,
    group: `group by p.rms_pedido,pi2.sku, nf.numero, nf.dt_emissao,nf.natureza,pi2.descricao,
  pi2.material_descricao,  d.nome,   p.qtd_total,
  f.nome, certifierAbr,f.cnpj, c.dt_prev_entrega,cps.dt_termino,piad.created_at,c.status`
  }
}

export const QUERY_COLLECTION_ORDERS = {
  Orders: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsOrders()}
      ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  SpecificOrder: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSpecificOrder()}
        ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  details: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsDetails().query}
        ${conditions ? `WHERE ${conditions}` : ''}
        ${makeSelectAndFromConditionsDetails().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  }
}
