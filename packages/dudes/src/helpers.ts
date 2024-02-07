const option = new Option()

export function isValidColor(color: string): boolean {
  option.style.color = color
  return !(option.style.color === '' || color === 'transparent')
}
