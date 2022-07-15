export class Generator {
  public static numeric(length = 6) {
    const parts = Array.from({ length }, () => Math.floor(Math.random() * 10))
    return parts.join('')
  }

  public static alpha(length = 16) {
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numeric = '0123456789'
    const source = `${lower}${upper}${numeric}`

    const parts = Array.from({ length }, () => {
      const index = Math.floor(Math.random() * (source.length - 1))
      return source[index]
    })

    return parts.join('')
  }
}
