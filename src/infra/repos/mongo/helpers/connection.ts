import { 
  createConnection, 
  getConnection, 
  getConnectionManager, 
  ObjectType, 
  QueryRunner, 
  Repository, 
  Connection, 
  getRepository, 
  ObjectLiteral 
} from 'typeorm'
import { ConnectionNotFoundError, TransactionNotFoundError } from './errors'
import { DbTransaction } from '@/application/contracts'

export class MongoConnection implements DbTransaction {
  private static instance?: MongoConnection
  private query?: QueryRunner
  private connection: Connection

  private constructor () {}

  static getInstance (): MongoConnection {
    if (MongoConnection.instance === undefined) MongoConnection.instance = new MongoConnection()

    return MongoConnection.instance
  }

  async connect (): Promise<void> {
    this.connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()
  }

  async disconnect (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()

    await getConnection().close()

    this.query = undefined
    this.connection = undefined!
  }

  async openTransaction (): Promise<void> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()

    this.query = this.connection.createQueryRunner()

    await this.query.startTransaction()
  }

  async closeTransaction (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()

    await this.query.release()
  }

  async commit (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()

    await this.query.commitTransaction()
  }

  async rollback (): Promise<void> {
    if (this.query === undefined) throw new TransactionNotFoundError()

    await this.query.rollbackTransaction()
  }

  getRepository<Entity> (entity: ObjectType<Entity>): Repository<ObjectLiteral> {
    if (this.connection === undefined) throw new ConnectionNotFoundError()
    if (this.query !== undefined) return this.query.manager.getRepository(entity)

    return getRepository(entity)
  }
}