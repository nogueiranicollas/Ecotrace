const makeSelectAndFromConditionsSumary = () => {
  return {
    query: `select
    count(distinct rms_pedido) as totalOrders,
    sum(p.qtd_total) as totalVolumes,
    COUNT((CASE WHEN c.status  = 'Finalizado' THEN c.status  END)) as ordersDeliveried,
    SUM((CASE WHEN c.status  = 'Finalizado' THEN p.qtd_total END)) as volumesDeliveried,
    COUNT((CASE WHEN c.status  <> 'Finalizado' THEN c.status  END)) AS ordersOpen,
    SUM((CASE WHEN c.status  <> 'Finalizado' THEN p.qtd_total END)) as volumesOpen,
    COUNT((CASE WHEN c.dt_prev_entrega < now() THEN c.status  END)) AS OrderLated,
    SUM((CASE WHEN c.dt_prev_entrega < now() THEN p.qtd_total  END)) AS VolumeLated
    from confeccao c 
    join pedidos p  on p.rms_pedido in (c.nr_pedido)`
  }
}

export const QUERY_COLLECTION_SUMARY = {
  sumary: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsSumary().query}
      ${conditions ? `WHERE ${conditions}` : ''}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  }
}
