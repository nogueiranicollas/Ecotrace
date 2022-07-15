import { Language } from '@/Domain/Language/language.entity'

type LanguageView = Record<string, any>

export class View {
  transformOne(item: Language): LanguageView {
    return { id: item.id, label: item.language, tag: item.tag, flag: item.flag }
  }

  transformMany(items: Language[]): LanguageView[] {
    return items.map(this.transformOne)
  }
}
