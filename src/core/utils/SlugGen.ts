// https://www.npmjs.com/package/slug
import slug from "slug"

export default class SlugGen {
  constructor(private separator = "_") {
    this.separator = separator
  }

  generate(name: string) {
    return slug(name, this.separator)
  }
}
