export class Sanitizer {
  public static IP(raw: string | string[] | undefined): string {
    function _handle(ip: string) {
      return ip.replace(/^.*:/, '')
    }

    if (!raw) return '0.0.0.0'
    if (Array.isArray(raw)) return _handle(raw[0])
    return _handle(raw)
  }

  public static phone(raw: string): string {
    if (!raw) return raw
    if (typeof raw === 'object') return raw
    return raw.replace(/\D/gi, '').trim()
  }

  public static CEP(raw: string): string {
    if (!raw) return raw
    return raw.replace(/\D/gi, '').trim()
  }

  public static CPF(raw: string): string {
    if (!raw) return raw
    return raw.replace(/\D/gi, '').trim()
  }

  public static CNPJ(raw: string): string {
    if (!raw) return raw
    return raw.replace(/\D/gi, '').trim()
  }

  public static CPFCNPJ(raw: string): string {
    if (!raw) return raw
    return raw.replace(/\D/gi, '').trim()
  }
}
