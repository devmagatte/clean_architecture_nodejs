import { Request } from "express"

const { log } = console

interface FileParams {
  path: string
  filename: string
  originalname: string
  mimetype: string
  size: number
}

export default class UrlFileUtil {
  static getUrlFiles(req: Request, pathImage: string): string[] {
    try {
      const array: string[] = []
      const medias = UrlFileUtil.convertToListOfFileParams(req.files)
      for (const file of medias) {
        const { filename } = file
        const baseUrlImage = `${pathImage}/${filename}`
        const hostUrlImage = UrlFileUtil.setUrlWithHosting(req, baseUrlImage)
        array.push(hostUrlImage)
      }
      return array
    } catch (error: any) {
      throw Error(error)
    }
  }

  static setUrlWithHosting(req: Request, imageUrl: string): string {
    return `${req.protocol}://${req.get("host")}/${imageUrl}`
  }

  static convertToListOfFileParams(
    files:
      | Express.Multer.File[]
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined,
  ): FileParams[] {
    const listFileParams: FileParams[] = []
    if (Array.isArray(files)) {
      for (const file of files) {
        const fileObject: FileParams = file as FileParams
        listFileParams.push(fileObject)
      }
      return listFileParams
    }
    return listFileParams
  }
}
