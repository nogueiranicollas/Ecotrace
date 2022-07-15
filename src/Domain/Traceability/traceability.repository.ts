import { readFile } from 'fs'
import { resolve } from 'path'
import { get, orderBy } from 'lodash'

import { PGDB } from '@/Shared/Database/knex'
import { QueryUtil } from '@/Shared/Utils/query.utils'
import { Accesses } from '@/Shared/Protocols'
import { makeAccessesFilterQuery } from '@/Shared/Utils'
import { fetchOrderKpis } from '@/Shared/Utils/traceabilityTable/fetchOrderKpis'

import { FiltersPayload } from '../TraceabilityFilter/traceabilityFilter.service'

const STATE_FILE = resolve(__dirname, 'IBGEStates.json')
const CITIES_FILE = resolve(__dirname, 'IBGECities.json')
const FIRST_COLUMN_KEYS = ['ranchname', 'state', 'city']

enum NODES {
  properties,
  states,
  cities,
  biomes
}

export type OrderQuery = FiltersPayload

const ORDERS_KPI_COLUMNS = {
  totalOrders: 'total_orders',
  deliveredOrders: 'delivered_orders',
  openOrders: 'open_orders',
  delayedOrders: 'delayed_orders'
}

const CHART_COLUMNS = {
  animals: 'animals',
  boningout: 'boning_out_id',
  cargo: 'order_cargo',
  city: 'source_city',
  client: 'client_name',
  clientdoc: 'client_doc',
  industry: 'industry_name',
  industrydoc: 'industry_doc',
  meet: 'meet',
  order: 'order_id',
  ranchcar: 'source_ranch_car',
  ranchlat: 'source_ranch_location_lat',
  ranchlng: 'source_ranch_location_lng',
  ranchname: 'source_ranch_nickname',
  state: 'source_state',
  uid: 'uid'
}

export type ChartQuery = {
  firstColumn: string | number
  secondColumn: string | number
  thirdColumn: string | number
  begin?: Date
  end?: Date
  days?: number[]
  months?: number[]
  years?: number[]
}

export class Repository {
  private $client: PGDB
  private $query: typeof QueryUtil

  private ibgeStates: { id: number; name: string }[] = []
  private ibgeCities: { id: number; name: string; biome: string[] }[] = []

  constructor({ $PGDB = PGDB, $Query = QueryUtil } = {}) {
    this.$client = new $PGDB()
    this.$query = $Query

    readFile(STATE_FILE, (_, data) => {
      this.ibgeStates = JSON.parse(data.toString())
    })
    readFile(CITIES_FILE, (_, data) => {
      this.ibgeCities = JSON.parse(data.toString())
    })
  }

  private calculatePercentage(value, totalAnimals, totalMeat) {
    const meatParcel = (parseFloat(value) * 100) / totalMeat
    const meatPercentage = (totalAnimals * meatParcel) / 100
    return parseFloat(meatPercentage.toFixed(2))
  }

  private mountPropertiesNode({
    ranchname,
    ranchlat,
    ranchlng
  }: typeof CHART_COLUMNS) {
    return {
      id: ranchname,
      latlng: [ranchlat, ranchlng]
    }
  }

  private mountIndustryNode({ industry }) {
    return { id: industry }
  }

  private mountClientNode({ client }) {
    return { id: client }
  }

  private mountStateNode({ state }) {
    const IBGE = get(this.ibgeStates, state, { id: '', name: state })
    return {
      id: state,
      name: IBGE.name,
      geo: { category: 'uf', value: [String(IBGE.id)] }
    }
  }

  private mountCityNode({ city }) {
    const IBGE = get(this.ibgeCities, city, { id: '', name: city })
    return {
      id: city.toLocaleUpperCase(),
      name: IBGE.name.toLocaleUpperCase(),
      geo: { category: 'city', value: [String(IBGE.id)] }
    }
  }

  private mountBiomesNode({ city, ranchname, ranchlat, ranchlng }) {
    const IBGE = get(this.ibgeCities, city, { id: '', name: city, biome: [] })
    return {
      id: IBGE.biome.join(' - ').toLocaleUpperCase(),
      name: IBGE.biome.join(' - ').toLocaleUpperCase(),
      geo: {
        category: 'biome',
        value: IBGE.biome,
        latlng: [
          {
            id: ranchname,
            position: [ranchlat, ranchlng]
          }
        ]
      }
    }
  }

  private mountQuery(column, params: ChartQuery) {
    const that = this
    return (query) => {
      if (params.begin && params.begin) {
        return query.whereRaw(`DATE(${column}) BETWEEN ? AND ?`, [
          params.begin,
          params.end
        ])
      }
      if (params.days || params.months || params.years) {
        const dates = that.$query.monthDaysAndYearsHandler(params)
        if (dates.length) {
          return query.whereRaw(`DATE(${column}) in (${dates})`)
        } else return query.where(column, '=', null)
      }
      return query.where(column, '>=', that.$query.getDefaultDateFilter())
    }
  }

  private mountChartQuery(query: ChartQuery, accesses: Accesses) {
    const _query = this.$client
      .knex('origem_industria_cliente')
      .column(CHART_COLUMNS)
      .where(this.mountQuery('bought_at', query))

    if (Object.keys(accesses).length)
      return _query.whereRaw(
        makeAccessesFilterQuery(accesses, 'origem_industria_cliente')
      )
    return _query
  }

  private mountOrdersQuery(query: ChartQuery, accesses: Accesses) {
    const _query = this.$client
      .knex('pedidos')
      .column(ORDERS_KPI_COLUMNS)
      .where(this.mountQuery('created_at', query))

    if (Object.keys(accesses).length)
      return _query.whereRaw(makeAccessesFilterQuery(accesses, 'pedidos'))
    return _query
  }

  private getTopProperties({
    data,
    keys = { destiny: 'industrydoc', source: 'ranchcar' }
  }) {
    function getAnimals(sources, key) {
      const raw = get(sources, key, { animals: 0 }).animals
      return parseInt(raw)
    }

    const sources: Record<
      string,
      { animals: number; destiny: string; key: string; source: string }
    > = {}
    for (const item of data) {
      const source = get(item, keys.source, 'N/A')
      const destiny = get(item, keys.destiny, 'N/A')

      const key = `${source}_${destiny}`
      const animals =
        parseInt(get(item, 'animals', 0)) + getAnimals(sources, key)

      sources[key] = { animals, destiny, key, source }
    }

    const top = orderBy(
      sources,
      ['animals', 'source', 'destiny'],
      ['desc', 'asc', 'asc']
    ).slice(0, 10)
    const topKeys = top.map(({ key }) => key)

    const others: Record<
      string,
      { animals: number; destiny: string; source: string }
    > = {}
    for (const item of Object.values(sources)) {
      const { animals, destiny, key } = item

      if (topKeys.includes(key)) continue
      const _animals = animals + getAnimals(others, destiny)
      others[destiny] = { source: 'OUTROS', destiny, animals: _animals }
    }

    const _top = orderBy(top, [2, 0, 1], ['desc', 'asc', 'asc'])
    const links = [..._top, ...Object.values(others)].map(
      ({ destiny, source, animals }) => [source, destiny, animals, animals]
    )
    return links
  }

  private getTopClient({
    data,
    keys = { destiny: 'industry', source: 'client' }
  }) {
    function getAnimals(sources, key) {
      const raw = get(sources, key, { meet: 0 }).meet
      return parseFloat(raw)
    }

    let totalAnimals = 0
    let totalMeet = 0

    const sources: Record<
      string,
      { meet: number; destiny: string; key: string; source: string }
    > = {}
    for (const item of data) {
      totalAnimals += parseInt(item.animals, 10)
      totalMeet += parseFloat(item.meet)

      const source = get(item, keys.source, 'N/A')
      const destiny = get(item, keys.destiny, 'N/A')

      const key = `${source}_${destiny}`
      const meet = parseInt(get(item, 'meet', 0)) + getAnimals(sources, key)

      sources[key] = { meet, destiny, key, source }
    }

    const top = orderBy(
      sources,
      ['meet', 'source', 'destiny'],
      ['desc', 'asc', 'asc']
    ).slice(0, 10)
    const topKeys = top.map(({ key }) => key)

    const others: Record<
      string,
      { meet: number; destiny: string; source: string }
    > = {}
    for (const item of Object.values(sources)) {
      const { meet, source, key } = item

      if (topKeys.includes(key)) continue
      const _meet = meet + getAnimals(others, source)
      others[source] = { source, destiny: 'OUTROS CLIENTES', meet: _meet }
    }

    const _top = orderBy(top, [2, 0, 1], ['desc', 'asc', 'asc'])
    const links = [..._top, ...Object.values(others)].map(
      ({ destiny, source, meet }) => [
        source,
        destiny,
        this.calculatePercentage(meet, totalAnimals, totalMeet),
        parseFloat(meet.toFixed(2))
      ]
    )
    return links
  }

  public async find(query: ChartQuery, accesses: Accesses) {
    const [map] = await Promise.all([
      this.mountOrdersQuery(query, accesses).select()
    ])

    const data: [string, string, number, number][] = []
    const nodes = {}
    // const biomes = {}

    // for (const item of map) {
    //   if (!Object.keys(nodes).includes(item.clientdoc)) {
    //     Object.assign(nodes, { [item.clientdoc]: this.mountClientNode(item) })
    //   }
    //   if (!Object.keys(nodes).includes(item.industrydoc)) {
    //     Object.assign(nodes, {
    //       [item.industrydoc]: this.mountIndustryNode(item)
    //     })
    //   }

    //   if (
    //     query.firstColumn === NODES.states &&
    //     !Object.keys(nodes).includes(item.state)
    //   ) {
    //     Object.assign(nodes, { [item.state]: this.mountStateNode(item) })
    //   }

    //   if (
    //     query.firstColumn === NODES.cities &&
    //     !Object.keys(nodes).includes(item.city)
    //   ) {
    //     Object.assign(nodes, { [item.city]: this.mountCityNode(item) })
    //   }

    //   if (query.firstColumn === NODES.biomes) {
    //     const biome = this.mountBiomesNode(item)

    //     if (!Object.keys(biomes).includes(item.ranchcar)) {
    //       Object.assign(nodes, {
    //         [biome.id]: {
    //           ...biome,
    //           geo: nodes[biome.id]?.geo
    //             ? {
    //                 ...nodes[biome.id].geo,
    //                 latlng: nodes[biome.id]?.geo?.latlng
    //                   ? [...nodes[biome.id].geo.latlng, ...biome.geo.latlng]
    //                   : biome.geo.latlng
    //               }
    //             : biome.geo
    //         }
    //       })

    //       Object.assign(biomes, {
    //         [item.ranchcar]: this.mountPropertiesNode(item)
    //       })
    //     }

    //     data.push([
    //       biome.id,
    //       item.industry,
    //       parseInt(item.animals, 10),
    //       parseInt(item.animals, 10)
    //     ])
    //   }

    //   if (
    //     query.firstColumn === NODES.properties &&
    //     !Object.keys(nodes).includes(item.ranchcar)
    //   ) {
    //     Object.assign(nodes, {
    //       [item.ranchcar]: this.mountPropertiesNode(item)
    //     })
    //   }
    // }

    const chartDataSourcesIndustry = this.getTopProperties({
      data: map,
      keys: {
        source: FIRST_COLUMN_KEYS[query.firstColumn],
        destiny: 'industry'
      }
    })

    const chartDataSourcesClient = this.getTopClient({
      data: map,
      keys: {
        source: 'industry',
        destiny: 'client'
      }
    })

    const result = [] as any
    if (data.length) {
      data.reduce((res, value) => {
        if (!res[value[0][0]]) {
          res[value[0][0]] = [value[0], value[1], 0, 0]
          result.push(res[value[0][0]])
        }
        res[value[0][0]][2] += value[2]
        res[value[0][0]][3] += value[3]
        return res
      }, {})
    }

    const industryChart = result.length ? result : chartDataSourcesIndustry

    const sankeyChart = orderBy(
      [...industryChart, ...chartDataSourcesClient],
      [0, 1, 2],
      ['asc', 'asc', 'desc']
    )

    return {
      sankeyChart,
      nodesChart: Object.values(nodes)
    }
  }

  public async findOrdersKpi(
    // { limit, page, column, direction },
    filters: OrderQuery = {},
    accesses?: Accesses
  ) {
    const params = filters

    Object.assign(params, {
      ...filters
      // limit,
      // page,
      // column: ORDERS_KPI_COLUMNS[column],
      // direction
    })

    const db = this.$client.knex

    return fetchOrderKpis({ db, params, accesses })
  }
}
