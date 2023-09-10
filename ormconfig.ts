module.exports = {
  type: 'mongodb',
  url: process.env.MONGO_URL,
  synchronize: true,
  logging: true,
  entities: [
    `${process.env.TS_NODE_ENV === undefined ? 'dist' : 'src'}/infra/repos/mongo/entities/index.{js,ts}`
  ]
}