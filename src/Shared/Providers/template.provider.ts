import { readFile, stat } from 'fs'
import handlebars from 'handlebars'
import { get } from 'lodash'
import { join } from 'path'
import { promisify } from 'util'

import { template as config } from '@/Config'
import { AppError } from '@/Shared/Protocols'
import { $errors } from '@/Shared/Utils'

type PopulatedTemplates = {
  html: string
  text: string
}

const asyncReadFile = promisify(readFile)
const asyncStat = promisify(stat)

interface TemplateEngine {
  populate(
    templateName: string,
    context: Record<string, any>
  ): Promise<PopulatedTemplates>
}

async function getTemplates(name: string) {
  async function _readFile(path, options) {
    try {
      const fileStat = await asyncStat(path)
      if (!fileStat.isFile()) throw new Error()
      return asyncReadFile(path, options)
    } catch (ex) {
      throw new AppError($errors.templateNotFound, { path })
    }
  }

  const [html, text] = await Promise.all([
    _readFile(join(config.folder, 'html', `${name}.html`), {
      encoding: 'utf-8'
    }),
    _readFile(join(config.folder, 'txt', `${name}.txt`), {
      encoding: 'utf-8'
    })
  ])

  return { html, text }
}

class HandlebarsAdapter implements TemplateEngine {
  async populate(templateName: string, context: Record<string, any>) {
    const { html, text } = await getTemplates(templateName)

    const hblText = handlebars.compile(text)
    const hblHtml = handlebars.compile(html)

    return { html: hblHtml(context), text: hblText(context) }
  }
}

export class Template {
  private engine: TemplateEngine

  constructor({ engine }: { engine: string } = config) {
    const engines = { handlebars: HandlebarsAdapter }

    const Engine = get(engines, engine, engines.handlebars)
    this.engine = new Engine()
  }

  public populate(templateName: string, context: Record<string, any>) {
    return this.engine.populate(templateName, context)
  }
}
