import { Biome } from '@/Domain/Biomes/biomes.entity'

type BiomeView = Record<string, any>

export class View {
  transformOne(item: Biome): BiomeView {
    return { id: item.id, label: item.biome, tag: item.tag }
  }

  transformMany(items: Biome[]): BiomeView[] {
    return items.map(this.transformOne)
  }
}
