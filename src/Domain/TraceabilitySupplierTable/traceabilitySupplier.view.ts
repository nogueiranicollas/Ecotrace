export class View {
  transformOne(item: any): Record<string, any> {
    return item
  }

  transformMany(items: any): Record<string, any>[] {
    return items.map((e) => this.transformOne(e))
  }
}
