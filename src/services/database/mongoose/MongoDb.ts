import mongoose from "mongoose"
import IDatabase from "../interface_database"

export default class MongoDb implements IDatabase {
  private database: typeof mongoose
  constructor(database: typeof mongoose = mongoose) {
    this.database = database
  }

  async connect(url_database: string): Promise<void> {
    try {
      this.database.set("strictQuery", false)
      await this.database.connect(url_database)
      console.info("Connection MongoDB réusie")
    } catch (error) {
      console.error("Error: Impossible de se connecter avec MongoDb")
    }
  }

  async close(): Promise<void> {
    try {
      await this.database.connection.close()
    } catch (error) {
      throw Error(error as string)
    }
  }
}
