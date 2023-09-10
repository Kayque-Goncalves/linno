import './config/module-alias'
import { MongoConnection } from '@/infra/repos/mongo/helpers'
import { env } from '@/main/config/env'

import 'reflect-metadata'

MongoConnection.getInstance().connect()
  .then(async () => {
    const { app } = await import('@/main/config/app')

    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  })
  .catch(console.error)