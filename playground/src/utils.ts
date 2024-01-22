import { randomNum } from '@zero-dependency/utils'

export function randomRgbColor(): string {
  return `rgb(${randomNum(0, 255)}, ${randomNum(0, 255)}, ${randomNum(0, 255)})`
}
