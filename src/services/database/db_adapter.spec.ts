import DbAdapter from "./db_adapter"
import IDatabase from "./interface_database"

const mockDatabase: IDatabase = {
  connect: jest.fn(),
  close: jest.fn(),
}

describe("DbAdapter", () => {
  let dbAdapter: DbAdapter
  const DATABASE_URL = "mongodb://localhost:27017/DB_ANITA_MANAGER" // Replace with your test database URL

  beforeEach(() => {
    dbAdapter = new DbAdapter(mockDatabase, DATABASE_URL)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should connect to the database", async () => {
    await dbAdapter.connectDatabase()

    expect(mockDatabase.connect).toHaveBeenCalledWith(DATABASE_URL)
    expect(mockDatabase.connect).toHaveBeenCalledTimes(1)
  })

  it("should close the database connection", async () => {
    await dbAdapter.closeDatabase()

    expect(mockDatabase.close).toHaveBeenCalledTimes(1)
  })
})
