import { readFile } from "fs/promises"

import ApiResponse from "../../../core/utils/ApiResponse"
import ISeeder from "../../../core/interfaces/InterfaceSeeder"
import SeederPath from "../../../core/utils/seeder_path"

import UserDatasource from "../datasources/UserTypeDatasource"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import UserTypeSpecificField from "../helpers/specific_field/UserTypeSpecificField"
import SlugGen from "../../../core/utils/SlugGen"

interface IDataSeederTypeUser {
  name: string
}

const URL_SEEDER_FILE = SeederPath.get("user", "UserType")

export default class UserTypeSeeder extends ApiResponse implements ISeeder {
  private urlSeeder = URL_SEEDER_FILE
  private matricule = new MatriculeGenerate()
  private slug = new SlugGen()

  constructor(private datasource = new UserDatasource()) {
    super("")
  }

  async getFileSeeder() {
    try {
      const fileContentBuffer = await readFile(this.urlSeeder)
      const fileContentString = fileContentBuffer.toString("utf-8")
      const parsedData: IDataSeederTypeUser[] = JSON.parse(
        fileContentString,
      ) as IDataSeederTypeUser[]
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
          message: "SEEDERS USER-TYPES",
          data: response,
        }
      }
      return {
        statusCode: 500,
        success: false,
        message: "FICHIER SEEDERS USER-TYPES INTROUVABLE",
      }
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: "FICHIER SEEDERS USER-TYPES INTROUVABLE",
      }
    }
  }

  async insertSeederIsNotExist(data: IDataSeederTypeUser[]) {
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

  async saveData(value: IDataSeederTypeUser) {
    try {
      const body = UserTypeSpecificField.fromBody(value)
      const slug = this.slug.generate(body.name)

      const match = {
        slug: slug,
      }

      const IS_EXIST = await this.datasource.isExiste(match)

      if (!IS_EXIST) {
        const code = this.matricule.generate()

        const bodyrequest = {
          ...body,
          code: code,
          slug: slug,
        }

        await this.datasource.store(bodyrequest)
        return true
      }
      return false
    } catch (error) {
      throw new Error(error as string)
    }
  }
}
