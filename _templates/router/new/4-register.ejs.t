---
inject: true
to: src/Router/api.router.ts
after: '// Routers'
skip_if: 'router: <%= Name %>Router'
---
    { slug: '/<%= name %>', router: <%= Name %>Router },