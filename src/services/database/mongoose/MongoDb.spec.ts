// mongodb.test.ts
import {
  describe,
  expect,
  jest,
  it,
  beforeEach,
  afterEach,
} from "@jest/globals"

import MongoDb from "./MongoDb"
import mongoose, { Connection, Mongoose } from "mongoose"

jest.mock("mongoose")

const mongooseMock = {
  set: jest.fn(),
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
  },
} as unknown as Mongoose & { connection: Connection }

describe("MongoDb", () => {
  let mongoDb: MongoDb
  const DATABASE_NAME = "mongodb://localhost:27017/DB_ANITA_MANAGER" // Replace with your test database URL

  beforeEach(() => {
    mongoDb = new MongoDb(mongooseMock as typeof mongoose)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should connect to the database", async () => {
    await mongoDb.connect(DATABASE_NAME)

    expect(mongooseMock.connect).toHaveBeenCalledWith(DATABASE_NAME)
    expect(mongooseMock.connect).toHaveBeenCalledTimes(1)
  })

  it("should close the database connection", async () => {
    await mongoDb.close()

    expect(mongooseMock.connection.close).toHaveBeenCalledTimes(1)
  })
})
