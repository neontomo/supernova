import {
  abs,
  atan2,
  cos,
  min,
  random,
  sin,
  sqrt,
  twoTimesPi
} from "./js/math.js"
import {
  getRandomGaussian,
  randomDecimalBetween,
  randomIntBetween
} from "./js/random.js"
const spawnDot = () => {
  const angle = random() * twoTimesPi
  const radius = abs(getRandomGaussian(halfCoreRadius, halfCoreRadius))
  return {
    x: centerX + radius * cos(angle),
    y: centerY + radius * sin(angle),
    angle: angle,
    speed:
      random() < 0.01
        ? randomDecimalBetween(0.5, 6)
        : randomDecimalBetween(0.1, 1)
  }
}
const outOfBounds = (x, y, canvas) => {
  return x < 0 || x > canvas.width || y < 0 || y > canvas.height
}
const spawnDots = () => {
  for (let i = 0; i < numDotsPerFrame; i++) {
    dots.push(spawnDot())
  }
}
const drawDenseCore = () => {
  for (let i = 0; i < numDotsPerFrame * 500; i++) {
    const radius = abs(getRandomGaussian(0, coreRadius / 3))
    const angle = random() * twoTimesPi
    const x = centerX + radius * cos(angle)
    const y = centerY + radius * sin(angle)
    ctx.fillStyle = "white"
    ctx.fillRect(x, y, 1, 1)
  }
}
const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawDenseCore()
  spawnDots()
  for (let i = dots.length - 1; i >= 0; i--) {
    const dot = dots[i]
    dot.x += dot.speed * cos(dot.angle)
    dot.y += dot.speed * sin(dot.angle)
    const dx = canvasCenterX - dot.x
    const dy = canvasCenterY - dot.y
    const distanceToCenter = sqrt(dx * dx + dy * dy)
    if (distanceToCenter < randomIntBetween(30, 100)) {
      ctx.fillStyle = "white"
      ctx.fillRect(dot.x, dot.y, 1, 1)
    } else {
      ctx.fillStyle = dotColor
      ctx.fillRect(dot.x, dot.y, 1, 1)
    }
    if (outOfBounds(dot.x, dot.y, canvas)) {
      dots.splice(i, 1)
    }
  }
  requestAnimationFrame(animate)
}
const explosion = () => {
  if (numDotsPerFrame - 10 > 0) {
    numDotsPerFrame = numDotsPerFrame - 10
    explosionElement.classList.add("explode")
  } else {
    gameOver = true
    numDotsPerFrame = 0
    explosionElement.classList.add("explode-big")
  }
  setTimeout(() => {
    explosionElement.classList.remove("explode")
  }, 6000)
  dots.forEach((dot) => {
    const dx = canvasCenterX - dot.x
    const dy = canvasCenterY - dot.y
    const distance = sqrt(dx * dx + dy * dy)
    if (distance < randomIntBetween(30, 100)) {
      const targetAngle = atan2(dy, dx)
      const targetSpeed = randomIntBetween(10, 30)
      dot.angle += (targetAngle - dot.angle) * 0.2
      dot.speed += (targetSpeed - dot.speed) * 0.2
    }
  })
  if (!gameOver) {
    setTimeout(
      () => {
        explosion()
      },
      randomIntBetween(6, 12) * 1000
    )
  } else {
    document.querySelector("#fin").classList.add("fin-fade-in")
    document.querySelector("#fin").classList.add("fin-font-size")
    document.querySelector("main").classList.add("game-over")
  }
}
let gameOver = false
const canvas = document.querySelector("#supernova-canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let centerX = canvas.width / 2
let centerY = canvas.height / 2
let ctx = canvas.getContext("2d")
let canvasRectangle = canvas.getBoundingClientRect()
const explosionElement = document.querySelector("#supernova-explosion")
const coreRadius = min(canvas.width, canvas.height) / 16
const halfCoreRadius = coreRadius / 2
const canvasCenterX = canvasRectangle.width / 2
const canvasCenterY = canvasRectangle.height / 2
const dotColor = "#ffdcc8"
let numDotsPerFrame = 40
let dots = []
window.addEventListener("resize", () => {
  canvasRectangle = canvas.getBoundingClientRect()
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  centerX = canvas.width / 2
  centerY = canvas.height / 2
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  dots.length = 0
})
animate()
setTimeout(() => {
  explosion()
}, 3 * 1000)
