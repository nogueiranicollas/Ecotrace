export type AppGeoPoint = {
  lat: number
  lng: number
}

export type PgGeoPoint = {
  x: number
  y: number
}

export class GeoPoint {
  public lat: number
  public lng: number

  private fromPgGeoPoint(pgGeoPoint: PgGeoPoint) {
    this.lat = pgGeoPoint.x
    this.lng = pgGeoPoint.y
  }

  private fromAppGeoPoint(appGeoPoint: AppGeoPoint) {
    Object.assign(this, appGeoPoint)
  }

  private fromString(stringGeoPoint: string) {
    if (!stringGeoPoint.includes(',')) return
    const [lat, lng] = stringGeoPoint
      .split(',')
      .map((each) => each.trim())
      .slice(0, 2)
      .map((each) => {
        if (isNaN(parseInt(each)))
          throw new Error('fail to parse string geo point')
        return parseInt(each, 10)
      })
    Object.assign(this, { lat, lng })
  }

  constructor(rawGeoPoint: AppGeoPoint | PgGeoPoint | string = '') {
    if (!rawGeoPoint || rawGeoPoint === 'undefined') {
      Object.assign(this, { lat: 0, lng: 0 })
    } else if (typeof rawGeoPoint === 'string') this.fromString(rawGeoPoint)
    else if ('x' in rawGeoPoint) this.fromPgGeoPoint(rawGeoPoint)
    else this.fromAppGeoPoint(rawGeoPoint as AppGeoPoint)
  }

  public toString(): string {
    return `${this.lat},${this.lng}`
  }

  public toJSON(): AppGeoPoint {
    return { lat: this.lat, lng: this.lng }
  }
}

export const geoPointTransformer = {
  to: (val): string => new GeoPoint(val).toString(),
  from: (val): AppGeoPoint => new GeoPoint(val).toJSON()
}
