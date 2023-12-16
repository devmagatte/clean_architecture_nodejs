import { Request } from "express"
import OptionPagination from "./OptionPagination"

describe("OptionPagination", () => {
  it("should initialize page and limit from request query parameters", () => {
    const requestMock: Partial<Request> = {
      query: {
        page: "2", // Note: using string as query parameters are typically strings
        limit: "20",
      },
    }
    const optionPagination = new OptionPagination(requestMock as Request)

    expect(optionPagination.page).toBe(2)
    expect(optionPagination.limit).toBe(20)
  })

  it("should use default values for page and limit if not provided in request", () => {
    const requestMock: Partial<Request> = {
      query: {},
    }

    const optionPagination = new OptionPagination(requestMock as Request)

    expect(optionPagination.page).toBe(1)
    expect(optionPagination.limit).toBe(10)
  })

  it("should handle non-integer values in request query", () => {
    const requestMock: Partial<Request> = {
      query: {
        page: "invalid",
        limit: "invalid",
      },
    }

    const optionPagination = new OptionPagination(requestMock as Request)

    expect(optionPagination.page).toBe(1)
    expect(optionPagination.limit).toBe(10)
  })

  describe("facetForMongoose", () => {
    it("should generate facet options for Mongoose pagination", () => {
      const pageParams = 3
      const limitParams = 25

      const facetOptions = OptionPagination.facetForMongoose(
        pageParams,
        limitParams,
      )

      expect(facetOptions).toEqual({
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: 3 } }],
          data: [{ $skip: 50 }, { $limit: 25 }],
        },
      })
    })

    it("should generate facet options for Mongoose pagination with params", () => {
      const facetOptions = OptionPagination.facetForMongoose()

      expect(facetOptions).toEqual({
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: 1 } }],
          data: [{ $skip: 0 }, { $limit: 10 }],
        },
      })
    })
  })
})
