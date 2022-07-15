import dotenv from 'dotenv'

import './yup.config'

import Config from './app.config'
dotenv.config({ path: Config.envPath })

export { Config as app }
export { default as api } from './api.config'
export { default as auth } from './auth.config'
export { default as cypher } from './cypher.config'
export { default as database } from './database.config'
export { default as dataWarehouses } from './dataWarehouses.config'
export { default as email } from './email.config'
export { default as jwt } from './jwt.config'
export { default as pwdRecovery } from './passwordRecovery.config'
export { default as sentry } from './sentry.config'
export { default as sms } from './sms.config'
export { default as template } from './template.config'
export { default as upload } from './upload.config'
export { default as ui } from './ui.config'
