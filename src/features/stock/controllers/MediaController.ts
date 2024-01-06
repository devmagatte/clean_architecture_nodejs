import { Request, Response } from "express"
// import { ParamsDictionary } from "express-serve-static-core"
// import { ParsedQs } from "qs"
import ApiResponse from "../../../core/utils/ApiResponse"
import MediasRepository from "../repositories/MediaRepository"
import OptionPagination from "../../../core/utils/OptionPagination"
import UrlFileUtil from "../../../core/utils/urlFileUtil"

const staticUrlImage = "medias"

export class MediasController extends ApiResponse {
  constructor(private repository = new MediasRepository()) {
    super("")
  }

  async index(req: Request, res: Response) {
    try {
      const pagination = new OptionPagination(req)
      const result = await this.repository.getAll(
        pagination.page,
        pagination.limit,
      )
      return this.success(res, 200, "Historique Tracking Sms", result)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async store(req: Request, res: Response) {
    try {
      const urlImage = UrlFileUtil.getUrlFiles(req, staticUrlImage)
      const urlHost = UrlFileUtil.setUrlsWithHosting(req, urlImage)

      const result = await this.repository.save(urlHost)
      return this.created(res, 201, "Medias créé", result)
    } catch (error: any) {
      return this.fail(res, error)
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { code } = req.params
      const result = await this.repository.delete(code)
      return this.created(res, 200, "Media supprimé", result)
    } catch (error: any) {
      return this.fail(res, error)
    }
  }
}
