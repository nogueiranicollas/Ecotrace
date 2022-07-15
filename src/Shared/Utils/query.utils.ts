import {
  differenceInDays,
  endOfMonth,
  format,
  isValid,
  parse,
  startOfMonth
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { compact, orderBy } from 'lodash'
import { ILike } from 'typeorm'

export class QueryUtil {
  constructor(
    private nonExactKeys: string[] = [],
    private renameKeys: Record<string, any> = {}
  ) {}

  public handle(raw: Record<string, any>) {
    const _handler = (_raw) => {
      const where = Object.fromEntries(
        Object.keys(_raw)
          .filter((key) => _raw[key])
          .map((key) => {
            const val = _raw[key]

            const _key = (() => {
              if (key in this.renameKeys) return this.renameKeys[key]
              return key
            })()
            const _val = (() => {
              if (this.nonExactKeys.includes(key)) return ILike(`%${val}%`)
              return val
            })()

            return [_key, _val]
          })
      )
      return where
    }

    if (Array.isArray(raw)) return raw.map(_handler)
    return _handler(raw)
  }

  public static getDefaultDateFilter() {
    const today = new Date()
    const offset = today.getTimezoneOffset() / 60

    return new Date(today.getFullYear(), 3, 19, -offset, 0, 0, 0)
  }

  public static monthDaysAndYearsHandler({
    days = Array.from({ length: 31 }).map((_, e) => e + 1),
    months = Array.from({ length: 12 }).map((_, e) => e + 1),
    years = [new Date().getFullYear()]
  } = {}) {
    const _months = orderBy(months, [], 'desc')

    const conditions = orderBy(years, [], 'desc').map((year) => {
      return _months.map((month) => {
        const _month = month - 1

        const totalDays = differenceInDays(
          endOfMonth(new Date(year, _month, 1)),
          startOfMonth(new Date(year, _month, 1))
        )

        const newDays =
          days.length <= totalDays + 1
            ? days
            : Array.from({ length: totalDays + 1 }).map((_, e) => e + 1)

        const _days = orderBy(newDays, [], 'desc')

        return _days.map((day) => {
          const parsedDate = parse(`${day}/${month}/${year}`, 'P', new Date(), {
            locale: ptBR
          })
          const validDate = isValid(parsedDate)

          if (validDate) {
            return `'${format(
              new Date(year, _month, day, 0, 0, 0, 0),
              'yyyy-MM-dd'
            )}'`
          } else {
            return null
          }
        })
      })
    })

    return compact(conditions.flat(2))
  }
}
