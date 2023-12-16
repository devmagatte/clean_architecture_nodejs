import { ParamsMailling } from "./mailling"

export default interface IMailling {
  sendMail(paramsMailling: ParamsMailling): void
}
