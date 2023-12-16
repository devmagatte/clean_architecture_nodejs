interface IDatabase {
  connect(url_database: string): void
  close(): void
}
export default IDatabase
