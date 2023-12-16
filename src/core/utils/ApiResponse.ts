import { Response } from "express"

export default class ApiResponse {
  constructor(private jsonResponse: any) {
    this.jsonResponse = (
      res: Response,
      code: number,
      success: boolean,
      message: string,
      data: any,
    ) => res.status(code).json({ statusCode: code, success, message, data })
  }

  created(res: Response, code: number, message: string, data: any) {
    return this.jsonResponse(res, code, true, message, data)
  }

  success(res: Response, code: number, message: string, data: any) {
    return this.jsonResponse(res, code, true, message, data)
  }

  // The query syntax is incorrect.
  clientError(res: Response, message?: string) {
    return this.jsonResponse(res, 400, false, message ?? "Bad Request")
  }

  // Authentication is required to access the resource.
  unauthorized(res: Response, message?: string) {
    return this.jsonResponse(res, 401, false, message ?? "Unauthorized")
  }

  // Error Server.
  fail(res: Response, error: string) {
    return this.jsonResponse(res, 403, false, error)
  }

  tooManyRequest(res: Response, error: string) {
    return this.jsonResponse(res, 429, false, error)
  }

  sendError(error: unknown, res: Response): void {
    if (typeof error === "string") {
      this.fail(res, error)
    } else if (error instanceof Error) {
      this.fail(res, error.message)
    } else {
      this.fail(res, "Bad Request")
    }
  }
}
