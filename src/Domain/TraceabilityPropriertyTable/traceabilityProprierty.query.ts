const makeSelectAndFromConditionsProprierty = () => {
  return {
    query: `select 
    p.rms_pedido  as orderNumber,
    npf.tipo_produtor as productorType,
    npf.nome_produtor as productorName,
    npf.nome_propriedade as propriertyName,
    npf.faz_car as propriertyCar,
    npf.cnpj_produtor as productorCnpj,
    npf. ie as IE,
    npf.endereco as address,
    npf.cidade as city,
    npf.uf as state,
    npf.cidade_beneficiamento as beneficiationCity,
    npf.uf_beneficiamento as beneficiationState, 
    npf.cnpj_unidade_beneficiamento as beneficiationCNPJ,
    npf.geo_latitude as latitude,
    npf.geo_longitude as longitude
    from novelos_propriedades_fardos npf
    inner join novelos n on n.id in (npf.id_novelo)
    inner join novelos_producao np on np.id_novelo in (n.id)
    inner join tecelagem_origem to2 on to2.cod_barras in (np.cod_barras)
    inner join tecelagem_producao tp on tp.id_lote in (to2.id_lote )
    inner join confeccao_tecido ct on ct.cod_barras in (tp.cod_barras)
    inner join confeccao_producao cp on cp.id in (ct.id_confeccao_producao)
    inner join confeccao c on c.id in (cp.id_confeccao )
    inner join pedidos p on p.rms_pedido in (c.nr_pedido)
    inner join parceiros p2 on p2.author in (n.autor)`,
    group: `group by 
    p.rms_pedido,
    npf.tipo_produtor,
    npf.nome_propriedade,
    npf.faz_car,
    npf.cnpj_produtor,
    npf. ie,
    npf.endereco,
    npf.cidade,
    npf.uf,
    npf.cidade_beneficiamento,
    npf.uf_beneficiamento, npf.cnpj_unidade_beneficiamento,
    npf.geo_latitude, npf.geo_longitude,npf.nome_produtor  `
  }
}

const makeSelectAndFromConditionsDetails = () => {
  return {
    query: `select 
    pc.certification_name as certification,
    pc.certification_acronym as certificationAcronym,
    pc.certification_name as certificationNumber,
    pc.expiration_date as expirationDate,
    pc."cnpjCert" as certifierCNPJ
    from properties p
    inner join property_certifications pc on pc.property_id in (p.id)`,
    group: `group by
    pc.certification_name,
    pc.certification_acronym,
    pc.certification_name,
    pc.expiration_date,
    pc."cnpjCert"`
  }
}

export const QUERY_COLLECTION_PROPRIERTY = {
  proprierty: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsProprierty().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsProprierty().group}`,
    orderNumber: (param) => `p.rms_pedido = '${param}'`
  },
  certifications: {
    listRows: (conditions = '') =>
      `${makeSelectAndFromConditionsDetails().query}
      ${conditions ? `WHERE ${conditions}` : ''}
      ${makeSelectAndFromConditionsDetails().group}`,
    car: (param) => `p."CAR"  = '${param}'`
  }
}
