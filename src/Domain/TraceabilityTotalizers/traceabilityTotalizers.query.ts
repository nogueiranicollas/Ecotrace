const makeSelectAndFromConditionsSupplier = () => {
  return `select
  f.id as supplierid,
  f.cnpj as supplierCnpj,
  f.nome as supplierName,
  null as supplierCountry,
  p2.cidade  as supplierCity,
  p2.uf as supplierState,
  count(p.rms_pedido )as "orders",
  SUM(p.qtd_total ) as "volumes"
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)
  inner join parceiros p2 on p2.cnpj in (f.cnpj)
  group by f.nome,f.id,p2.cidade ,p2.uf`
}

const makeSelectAndFromConditionsSubProviders = () => {
  return `select
  cps.cnpj_subcontratado as outsourceCnpj,
  cps.razao_social_subcontratado as outsourceName,
  null as outsourceCountry,
  null as outsourceCity,
  null as outsourceState,
  count(p.rms_pedido )as "orders",
  SUM(p.qtd_total) as "volumes"
  from pedidos p
  inner join fornecedores f on f.id IN(p.fornecedor_id)
  inner join pedidos_itens pi2 on pi2.id_pedido IN(p.id)
  inner join confeccao c on c.nr_pedido IN(p.rms_pedido)
  inner join confeccao_producao cp on cp.id_confeccao IN(c.id)
  inner join confeccao_producao_subcontratados cps on cps.id_confeccao_producao = cp.id 
  group by cps.cnpj_subcontratado, cps.razao_social_subcontratado`
}

const makeSelectAndFromConditionsWeaving = () => {
  return `  select distinct p.cnpj as cnpj, p.nome_parceiro as name, p.cidade as city, p.uf as state  from tecelagem t join parceiros p on p.author = t.autor 
  `
}

const makeSelectAndFromConditionsWiring = () => {
  return `select distinct p.cnpj as cnpj, p.nome_parceiro as name, p.cidade as city, p.uf as state  from novelos n  join parceiros p on p.author = n.autor  `
}

export const QUERY_COLLECTION_TOTALIZERS = {
  supplier: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSupplier()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  subProviders: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSubProviders()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  weaving: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWeaving()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  WiringRanking: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWiring()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  }
}
