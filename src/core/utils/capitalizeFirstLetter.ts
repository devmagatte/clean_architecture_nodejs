export const capitalizeFirstLetter = (str: string) => {
  const pieces = str.split(" ")
  for (let i = 0; i < pieces.length; i++) {
    const j = pieces[i].charAt(0).toUpperCase()
    pieces[i] = j + pieces[i].substr(1)
  }
  return pieces.join(" ")
}
