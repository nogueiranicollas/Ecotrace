const makeSelectAndFromConditionsSuplyerRanking = () => {
  return `select p.origem_pedido as "country",count(p.rms_pedido) as "orders",SUM(p.qtd_total ) as "volumes" from pedidos
  p group by p.origem_pedido`
}

const makeSelectAndFromConditionsProvidersRanking = () => {
  return `select f.nome as "name" ,count(p.rms_pedido ) as "orders", SUM(p.qtd_total ) as "volumes" from pedidos p inner 
  join fornecedores f on f.id = p.fornecedor_id 
  group by f.nome`
}

const makeSelectAndFromConditionsWeavingRanking = () => {
  return `select p.nome_parceiro as "name" ,count(distinct(t.nr_pedido))as "orders",count(nr_ordem_producao)as "volumes"  from tecelagem t 
  join parceiros p on p.author = t.autor group by p.nome_parceiro`
}

const makeSelectAndFromConditionsWiringRanking = () => {
  return `select distinct(p.nome_parceiro) as "name",count(distinct(n.nr_ordem_mistura)) as "orders", count(n.id) as "volumes"  from novelos n 
  join novelos_origem nori on nori.id_novelo = n.id join parceiros p on p.author = n.autor group by p.nome_parceiro`
}

export const QUERY_COLLECTION_CHARTS = {
  supplyersRanking: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSuplyerRanking()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  ProviderRanking: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsProvidersRanking()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  WeavingRanking: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWeavingRanking()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  },
  WiringRanking: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsWiringRanking()}
        ${conditions ? `WHERE ${conditions}` : ''}`
  }
}
