interface IRepository {
  getAll(page: number, limit: number): any
  getOne(match: object): any
  getOneByCode(code: string): any
  save(body: any): any
  update(code: string, body: any): any
  deleteOne(code: string): any
}
export default IRepository
