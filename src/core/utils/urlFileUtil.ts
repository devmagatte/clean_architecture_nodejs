import { Request } from "express"
import { unlink } from "node:fs/promises"

const { log } = console

interface FileParams {
  path: string
  fieldname: string
  originalname: string
  buffer: Buffer
  mimetype: string
  size: number
}

export default class UrlFileUtil {
  static getUrlFileIsExist(req: Request, pathImage: string) {
    try {
      const { filename } = req.file
      return `${pathImage}/${filename.replace("images\\", "")}`
    } catch (error) {
      return ""
    }
  }

  static setUrlWithHosting(req, imageUrl) {
    return `${req.protocol}://${req.get("host")}/${imageUrl}`
  }

  static setUrlsWithHosting(req: Request, imagesUrl) {
    const filesParams = UrlFileUtil.convertToListOfFileParams(req.files)
    const array = []
    for (const path of filesParams) {
      array.push(`${req.protocol}://${req.get("host")}/${path.path.toString}`)
    }
    return array
  }

  static getUrlFiles(req, pathImage) {
    try {
      const array = []
      const { medias } = req.files
      for (const file of medias) {
        const { filename } = file
        array.push(`${pathImage}/${filename.replace("medias\\", "")}`)
      }
      return array
    } catch (error) {
      return ""
    }
  }

  static getUrlFilesIsExist(req, pathImage, nomChamp) {
    try {
      if (
        !nomChamp ||
        !req.files[nomChamp] ||
        !Array.isArray(req.files[nomChamp])
      ) {
        return ""
      }

      const urls = req.files[nomChamp].map((file) => {
        const { filename } = file
        return `${pathImage}/${filename.replace("images\\", "")}`
      })

      return urls
    } catch (error) {
      return ""
    }
  }

  static setUrlsWithHosting(req, imageUrl) {
    const urls = imageUrl.map(
      (url) => `${req.protocol}://${req.get("host")}/${url}`,
    )
    return urls
  }

  static deleteFileAsset(req, imageUrl) {
    try {
      const urlGet = `${req.protocol}://${req.get("host")}/`
      const substr = imageUrl.split(urlGet)

      unlink(`public/${substr[1]}`, (err) => {
        if (err) throw err
      })
    } catch (error) {
      log(error)
    }
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
        const { fieldname, originalname, buffer, mimetype, size, path } = file
        const fileObject: FileParams = {
          fieldname,
          originalname,
          buffer,
          mimetype,
          size,
          path,
        }
        listFileParams.push(fileObject)
      }
      return listFileParams
    }
    return listFileParams
  }
}
