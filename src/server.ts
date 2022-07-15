import { api as config } from '@/Config'

import http from 'http'

import App from './app'

const app = App()

http.createServer(app.server).listen(config.port, app.listen)
