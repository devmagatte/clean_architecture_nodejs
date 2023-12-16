import MatriculeGenerate from "./MatriculeGenerate"

describe("MatriculeGenerate", () => {
  it("should generate a matricule with a given prefix", () => {
    const matriculeGenerator = new MatriculeGenerate()
    const prefix = "ABC"
    const matricule = matriculeGenerator.generate(prefix)

    expect(matricule.startsWith(prefix)).toBe(true)

    expect(matricule.length).toBe(prefix.length + MatriculeGenerate.CODELENGTH)
  })

  it("should generate a matricule without a prefix", () => {
    const matriculeGenerator = new MatriculeGenerate()
    const matricule = matriculeGenerator.generate()

    expect(matricule.startsWith("ABC")).toBe(false)

    expect(matricule.length).toBe(MatriculeGenerate.CODELENGTH)
  })

  it("should generate a matricule with a custom length", () => {
    const customLength = 5
    const matriculeGenerator = new MatriculeGenerate()
    const matricule = matriculeGenerator.generate("", customLength)

    expect(matricule.length).toBe(customLength)
  })

  it("should generate unique matricules", () => {
    const matriculeGenerator = new MatriculeGenerate()
    const matricules = new Set<string>()

    for (let i = 0; i < 1000; i++) {
      const matricule = matriculeGenerator.generate()
      matricules.add(matricule)
    }

    expect(matricules.size).toBe(1000)
  })
})
