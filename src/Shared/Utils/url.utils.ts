export class URL {
  public static sanitize(url: string) {
    if (!url) return url

    const [, domain] = url.split('://')
    return domain.trim()
  }
}
