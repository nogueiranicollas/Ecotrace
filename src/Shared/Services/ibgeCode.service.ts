import axios from 'axios'

export async function cityInfo(ibgeId) {
  const cityInfo = await axios.get(
    `http://servicodados.ibge.gov.br/api/v1/localidades/municipios/${ibgeId}`
  )

  return {
    id: cityInfo.data.id,
    cityName: cityInfo.data.nome,
    uf: cityInfo.data.microrregiao.mesorregiao.UF.sigla
  }
}
