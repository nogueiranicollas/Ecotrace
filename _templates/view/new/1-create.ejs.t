---
to: src/Domain/<%= Name %>/<%= name %>.view.ts
unless_exists: true
---
type <%= Name %> = Record<string, any>
type <%= Name %>View = Record<string, any>

export class View {
  transformOne(item: <%= Name %>): <%= Name %>View {
    return item
  }

  transformMany(items: <%= Name %>[]): <%= Name %>View[] {
    return items.map(this.transformOne)
  }
}
