import { cos, floor, log, random, sqrt, twoTimesPi } from "./math.js"
export const getRandomGaussian = (mean, sd) => {
  const u = random()
  const v = random()
  const z = sqrt(-2 * log(u)) * cos(twoTimesPi * v)
  return z * sd + mean
}
export const randomDecimalBetween = (min, max) => {
  return random() * (max - min) + min
}
export const randomIntBetween = (min, max) => {
  return floor(random() * (max - min + 1) + min)
}
