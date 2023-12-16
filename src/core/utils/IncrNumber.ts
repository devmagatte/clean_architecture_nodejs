interface paramsIncr {
  current: string
  prefix?: string
  pad?: number
  start: number
}
export default class IncrNumber {
  static get(params: paramsIncr) {
    const numberConvert = Number(params.current)
    const number = params.current ? numberConvert + 1 : params.start
    let numberFacture

    if (params.pad) {
      numberFacture = `${number}`.padStart(params.pad, "0")
    } else {
      numberFacture = `${number}`
    }

    if (params.prefix) {
      return `${params.prefix}-${numberFacture}`
    }

    return `${numberFacture}`
  }
}
