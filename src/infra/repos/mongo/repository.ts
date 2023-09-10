import { MongoConnection } from './helpers'

import { ObjectLiteral, ObjectType, Repository } from 'typeorm'

export abstract class MongoRepository {
  constructor (private readonly connection: MongoConnection = MongoConnection.getInstance()) {}

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<ObjectLiteral> {
    return this.connection.getRepository(entity)
  }
}