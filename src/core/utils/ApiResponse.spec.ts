import { Response } from "express"
import ApiResponse from "./ApiResponse"

describe("ApiResponse", () => {
  let responseMock: Partial<Response>
  let apiResponse: ApiResponse

  beforeEach(() => {
    responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    apiResponse = new ApiResponse({})
  })

  it("should create a created response", () => {
    const message = "Create message"
    const data = { key: "value" }
    apiResponse.created(responseMock as Response, 200, message, data)

    expect(responseMock.status).toHaveBeenCalledWith(200)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 200,
      success: true,
      message,
      data,
    })
  })

  it("should create a success response", () => {
    const message = "Success message"
    const data = { key: "value" }
    apiResponse.success(responseMock as Response, 200, message, data)

    expect(responseMock.status).toHaveBeenCalledWith(200)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 200,
      success: true,
      message,
      data,
    })
  })

  describe("clientError", () => {
    it("should create a client error response", () => {
      const message = "Client error message"
      apiResponse.clientError(responseMock as Response, message)

      expect(responseMock.status).toHaveBeenCalledWith(400)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 400,
        success: false,
        message,
      })
    })
    it("should create a client error response", () => {
      const message = "Bad Request"
      apiResponse.clientError(responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(400)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 400,
        success: false,
        message,
      })
    })
  })

  describe("clientError", () => {
    it("should create an unauthorized response", () => {
      const message = "Unauthorized message"
      apiResponse.unauthorized(responseMock as Response, message)

      expect(responseMock.status).toHaveBeenCalledWith(401)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 401,
        success: false,
        message,
      })
    })

    it("should create an unauthorized response", () => {
      const message = "Unauthorized"
      apiResponse.unauthorized(responseMock as Response)

      expect(responseMock.status).toHaveBeenCalledWith(401)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 401,
        success: false,
        message,
      })
    })
  })

  it("should create an fail response", () => {
    const message = "Fail message"
    apiResponse.fail(responseMock as Response, message)

    expect(responseMock.status).toHaveBeenCalledWith(403)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 403,
      success: false,
      message,
    })
  })

  it("should send an error message as a string", () => {
    const errorMessage = "An error occurred"
    apiResponse.sendError(errorMessage, responseMock as Response)

    expect(responseMock.status).toHaveBeenCalledWith(403)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 403,
      success: false,
      message: errorMessage,
    })
  })

  it("should send an error message from an Error instance", () => {
    const error = new Error("An error occurred")
    apiResponse.sendError(error, responseMock as Response)

    expect(responseMock.status).toHaveBeenCalledWith(403)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 403,
      success: false,
      message: error.message,
    })
  })

  it("should send an error message from empty error message", () => {
    const errorMessage = "Bad Request"

    const error = undefined
    apiResponse.sendError(error, responseMock as Response)

    expect(responseMock.status).toHaveBeenCalledWith(403)
    expect(responseMock.json).toHaveBeenCalledWith({
      statusCode: 403,
      success: false,
      message: errorMessage,
    })
  })
})
