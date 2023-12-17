import { readFile } from "fs/promises"

import ApiResponse from "../../../core/utils/ApiResponse"
import ISeeder from "../../../core/interfaces/InterfaceSeeder"
import SeederPath from "../../../core/utils/seeder_path"

import UserTypeDatasource from "../datasources/UserTypeDatasource"
import { UserDatasource } from "../datasources/UserDatasource"
import { UserRepository } from "../repositories/UserRepository"

interface IDataSeederUser {
  name: string
  email: string
  password: string
  slug_user_type: string
}

const URL_SEEDER_FILE = SeederPath.get("user", "User")

export default class UserSeeder extends ApiResponse implements ISeeder {
  private urlSeeder = URL_SEEDER_FILE
  private userTypeDatasource = new UserTypeDatasource()

  constructor(private repository = new UserRepository(new UserDatasource())) {
    super("")
  }

  async getFileSeeder() {
    try {
      const fileContentBuffer = await readFile(this.urlSeeder)
      const fileContentString = fileContentBuffer.toString("utf-8")
      const parsedData: IDataSeederUser[] = JSON.parse(
        fileContentString,
      ) as IDataSeederUser[]
      return parsedData
    } catch (error) {
      return null
    }
  }

  async seed(): Promise<object> {
    try {
      const data = await this.getFileSeeder()
      if (data) {
        const { success, alreadyCreated, total } =
          await this.insertSeederIsNotExist(data)

        const response = {
          size: total,
          success,
          already_exist: alreadyCreated,
        }

        return {
          statusCode: 200,
          success: true,
          message: "SEEDERS USER",
          data: response,
        }
      }
      return {
        statusCode: 500,
        success: false,
        message: "FICHIER SEEDERS USER INTROUVABLE",
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: "FICHIER SEEDERS USER INTROUVABLE",
      }
    }
  }

  async insertSeederIsNotExist(data: IDataSeederUser[]) {
    const seederToInsert = data.length
    let Inserted = 0
    let alreadyCreated = 0

    for (const value of data) {
      const insertInto = await this.saveData(value)
      if (insertInto) {
        Inserted += 1
      } else {
        alreadyCreated += 1
      }
    }

    return {
      total: seederToInsert,
      success: Inserted,
      alreadyCreated,
    }
  }

  async saveData(value: IDataSeederUser) {
    try {
      const body = { slug: value.slug_user_type }
      const typeUser = await this.userTypeDatasource.findOne(body)

      const bodyrequest = {
        ...value,
        code_user_type: typeUser.code,
      }

      await this.repository.save(bodyrequest)

      return true
    } catch (error) {
      return false
    }
  }
}
