import IDatabase from "./interface_database"

export default class DbAdapter {
  constructor(
    private database: IDatabase,
    public url_database: string,
  ) {}

  async connectDatabase(): Promise<void> {
    try {
      this.database.connect(this.url_database)
    } catch (error) {
      throw Error("Connection error")
    }
  }

  async closeDatabase(): Promise<void> {
    try {
      this.database.close()
    } catch (error) {
      throw Error("Close error")
    }
  }
}
