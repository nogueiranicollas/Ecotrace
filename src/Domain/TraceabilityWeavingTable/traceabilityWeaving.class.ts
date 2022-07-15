export class Weaving {
  order: string
  cargo: string
  slaughterindustrycnpj: string
  boughtat: string
  slaughtedat: string
  producerdoc: string
  producerie: string
  producername: string
  propname: string
  propcar: string
  proplat: string
  proplng: string
  propcidade: string
  propestado: string
  constructor({
    nr_pedido: order,
    nr_carga: cargo,
    cnpj_industria: slaughterindustrycnpj,
    dt_compra: boughtat,
    dt_abate: slaughtedat,
    prod_cpf_cnpj: producerdoc,
    prod_nr_ie: producerie,
    prod_nome_razaosocial: producername,
    faz_nome: propname,
    faz_car: propcar,
    faz_lat: proplat,
    faz_lng: proplng,
    faz_cidade: propcidade,
    faz_estado: propestado
  }) {
    this.order = order
    this.cargo = cargo
    this.slaughterindustrycnpj = slaughterindustrycnpj
    this.boughtat = boughtat
    this.slaughtedat = slaughtedat
    this.producerdoc = producerdoc
    this.producerie = producerie
    this.producername = producername
    this.propname = propname
    this.propcar = propcar
    this.proplat = proplat
    this.proplng = proplng
    this.propcidade = propcidade
    this.propestado = propestado
  }

  toJSON() {
    return { ...this }
  }
}
