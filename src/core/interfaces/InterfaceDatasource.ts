interface IDatasource {
  findAll(page: number, limit: number): any
  filter(match: object): any
  findOneByCode(code: string): any
  store(body: any): any
  update(code: string, body: any): any
  deleteOne(code: string): any
  isExiste(match: object): Promise<boolean>
}
export default IDatasource
