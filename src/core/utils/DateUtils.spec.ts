import DateUtils from "./DateUtils"

describe("DateUtils", () => {
  it("should calculate the difference between two dates", () => {
    const date1 = new Date("2023-09-10T12:00:00Z")
    const date2 = new Date("2023-09-09T09:30:00Z")

    const diff = DateUtils.dateDiff(date1, date2)

    expect(diff.day).toBe(1)
    expect(diff.hour).toBe(2)
    expect(diff.min).toBe(30)
    expect(diff.sec).toBe(0)
  })

  it("should handle dates in reverse order", () => {
    const date1 = new Date("2023-09-09T09:30:00Z")
    const date2 = new Date("2023-09-10T12:00:00Z")

    const diff = DateUtils.dateDiff(date1, date2)

    expect(diff.day).toBe(-1)
    expect(diff.hour).toBe(-2)
    expect(diff.min).toBe(-30)
    expect(diff.sec).toBe(-0)
  })
})
