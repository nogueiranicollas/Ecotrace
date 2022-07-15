---
inject: true
to: src/Router/api.router.ts
after: 'import { a'
skip_if: <%= Name %>Router
---
import { Router as <%= Name %>Router } from '@/Domain/<%= Name %>'