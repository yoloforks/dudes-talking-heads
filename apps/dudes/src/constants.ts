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

// message box
export const ANIMATION_TIME = 500
export const ARROW_WIDTH = 22
export const ARROW_HEIGHT = 10
export const ARROW_HALF_WIDTH = ARROW_WIDTH / 2

// spitter
export const MOVE_SPEED = 50
export const ALPHA_SPEED = 1
export const SCALE_SPEED = 0.5
