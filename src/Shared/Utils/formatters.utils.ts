import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export class Formatter {
  public static date(raw: string | Date) {
    let _raw = raw as Date

    if (!raw) return null
    if (typeof raw === 'string') _raw = new Date(raw)
    if (isNaN(_raw.getDate())) return raw

    return format(_raw, 'dd/MM/yyyy', { locale: ptBR })
  }

  public static int(raw: string | number) {
    if (!raw) return raw

    let _raw = raw as number
    if (typeof raw === 'string') _raw = parseInt(raw, 10)
    if (isNaN(_raw)) return raw

    return Intl.NumberFormat('pt-br', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(_raw)
  }

  public static float(raw: string | number) {
    if (!raw) return raw

    let _raw = raw as number
    if (typeof raw === 'string') _raw = parseFloat(raw)
    if (isNaN(_raw)) return raw

    return Intl.NumberFormat('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(_raw)
  }

  public static geoPoint(raw: string | number) {
    if (!raw) return raw

    let _raw = raw as number
    if (typeof raw === 'string') _raw = parseFloat(raw)
    if (isNaN(_raw)) return raw

    return Intl.NumberFormat('pt-br', {
      minimumFractionDigits: 7,
      maximumFractionDigits: 7
    }).format(_raw)
  }

  public static phone(raw: string): string {
    if (!raw) return raw

    const separator = raw.length === 11 ? 7 : 6

    const area = raw.substring(0, 2)
    const parts = [raw.substring(2, separator), raw.substring(separator)]

    return `${area} ${parts.join('-')}`
  }

  public static CEP(raw: string): string {
    if (!raw) return raw

    const parts = [raw.substring(0, 5), raw.substring(5)]
    return parts.join('-')
  }

  public static CPF(raw: string): string {
    if (!raw) return raw

    const parts = [
      raw.substring(0, 3),
      raw.substring(3, 6),
      raw.substring(6, 9)
    ]
    const verifier = raw.substring(9)

    return `${parts.join('.')}-${verifier}`
  }

  public static CNPJ(raw: string): string {
    if (!raw) return raw

    let _raw = raw
    if (raw.length !== 14) _raw = raw.padStart(14, '0')

    const parts = [
      _raw.substring(0, 2),
      _raw.substring(2, 5),
      _raw.substring(5, 8)
    ]
    const branch = _raw.substring(8, 12)
    const verifier = _raw.substring(12)

    return `${parts.join('.')}/${branch}-${verifier}`
  }

  public static CPFCNPJ(raw: string): string {
    if (!raw) return raw

    if (raw.length <= 11) return Formatter.CPF(raw.padStart(11, '0'))
    return Formatter.CNPJ(raw.padStart(14, '0'))
  }
}
