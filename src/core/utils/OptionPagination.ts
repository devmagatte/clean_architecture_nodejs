import { Request } from "express"

export default class OptionPagination {
  page: any
  limit: any
  constructor(request: Request) {
    const pageParse = parseInt(request.query.page as string)
    const limitPase = parseInt(request.query.limit as string)
    this.page = pageParse || 1
    this.limit = limitPase || 10
  }

  static facetForMongoose(pageParams?: number, limitParams?: number) {
    const page = pageParams || 1
    const limit = limitParams || 10

    return {
      $facet: {
        metadata: [{ $count: "total" }, { $addFields: { page } }],
        data: [{ $skip: limit * (page - 1) }, { $limit: limit }],
      },
    }
  }
}
