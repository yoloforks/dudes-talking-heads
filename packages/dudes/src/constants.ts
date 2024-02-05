export const ROUND = 1000
export const DELTA_TIME = 0.02 * ROUND
export const SPRITE_SIZE = 32

type Collider = {
  x: number
  y: number
  width: number
  height: number
}

export const COLLIDER: Collider = {
  x: 8,
  y: 3,
  width: 16,
  height: 22
}
