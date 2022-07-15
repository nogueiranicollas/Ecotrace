---
to: src/Domain/<%= Name %>/<%= name %>.model.ts
unless_exists: true
---
import { uuid } from 'uuidv4'
import { Document, Schema, model } from 'mongoose'

interface I<%= Name %> extends Document {
  id: string
}

const <%= name %>Schema = new Schema(
  { id: { default: uuid(), required: true, type: String } },
  { _id: false, timestamps: true, versionKey: false }
)

export const Model = model<I<%= Name %>>(
  '<%= Name %>',
  <%= name %>Schema,
  '<%= h.inflection.pluralize(name) %>'
)
