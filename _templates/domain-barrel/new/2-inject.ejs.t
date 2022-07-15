---
inject: true
to: src/Domain/<%= Name %>/index.ts
after: export
skip_if: <%= alias %>
---
export { <%= h.capitalize(alias) %> } from './<%= name %>.<%= alias %>'