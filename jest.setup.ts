import { MongoMemoryServer } from "mongodb-memory-server"

const mongod = new MongoMemoryServer()

// This will be executed before your tests start
beforeAll(() => {
  const uri = mongod.getUri()
  process.env.DB_URL_MONGO_TEST = uri
})

// This will be executed after your tests finish
afterAll(async () => {
  await mongod.stop()
})
