export class PropertieDetails {
  fazCarNumber: string
  producerName: string
  fazName: string
  latitude: string
  longitude: string
  citie: string
  state: string
  sifNumber: string

  constructor({
    faz_car: fazCarNumber,
    prod_nome_razaosocial: producerName,
    faz_nome: fazName,
    faz_lat: latitude,
    faz_lng: longitude,
    faz_cidade: citie,
    faz_estado: state,
    nr_unidade_abate: sifNumber
  }) {
    this.fazCarNumber = fazCarNumber
    this.producerName = producerName
    this.fazName = fazName
    this.latitude = latitude
    this.longitude = longitude
    this.citie = citie
    this.state = state
    this.sifNumber = sifNumber
  }

  toJSON() {
    return { ...this }
  }
}
