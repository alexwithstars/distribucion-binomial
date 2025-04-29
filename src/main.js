import './style.css'
import { PARAMS } from './consts.js'
import { $, canvasDPI, checkInstance } from './utils.js'
import { probability } from './math.js'

const n = checkInstance($('#n'), window.HTMLInputElement)
const nMax = checkInstance($('#nMax'), window.HTMLInputElement)
const p = checkInstance($('#p'), window.HTMLInputElement)
const x = checkInstance($('#x'), window.HTMLInputElement)
const xValue = checkInstance($('#xValue'), window.HTMLInputElement)
const nValue = checkInstance($('#nValue'), window.HTMLInputElement)
const pValue = checkInstance($('#pValue'), window.HTMLInputElement)
const prob = checkInstance($('#prob'), window.HTMLSpanElement)
const e = checkInstance($('#e'), window.HTMLSpanElement)
const varianza = checkInstance($('#var'), window.HTMLSpanElement)
const canvas = checkInstance($('#canvas'), window.HTMLCanvasElement)
const ctx = checkInstance(canvas.getContext('2d'), window.CanvasRenderingContext2D)
const usefulHeight = PARAMS.HEIGHT - PARAMS.Y_OFFSET * 2 - PARAMS.RADIUS * 2
const usefulWidth = PARAMS.WIDTH - PARAMS.X_OFFSET * 2 - PARAMS.RADIUS * 2

function draw () {
  const nI = parseInt(n.value)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
  ctx.moveTo(PARAMS.X_OFFSET, PARAMS.HEIGHT)
  ctx.lineTo(PARAMS.X_OFFSET, 0)
  ctx.moveTo(0, PARAMS.HEIGHT - PARAMS.Y_OFFSET - PARAMS.RADIUS)
  ctx.lineTo(PARAMS.WIDTH, PARAMS.HEIGHT - PARAMS.Y_OFFSET - PARAMS.RADIUS)
  ctx.stroke()

  const step = usefulHeight / 10
  for (let i = 1; i <= 10; i++) {
    const x = PARAMS.X_OFFSET
    const y = PARAMS.HEIGHT - PARAMS.Y_OFFSET - step * i - PARAMS.RADIUS
    ctx.beginPath()
    ctx.moveTo(x - PARAMS.RADIUS, y)
    ctx.lineTo(x + PARAMS.RADIUS, y)
    ctx.stroke()
    ctx.closePath()
    ctx.fillStyle = '#000'
    ctx.font = '10px sans-serif'
    ctx.fillText(i / 10, x + PARAMS.RADIUS + 5, y + 5)
  }

  const gap = usefulWidth / (nI || 1)
  for (let i = 0; i <= nI; i++) {
    const cy = (1 - probability(nI, p.value, i)) * usefulHeight
    const cx = PARAMS.X_OFFSET * 2 + gap * i
    if (gap > 18 || i % 10 === 0) {
      ctx.strokeStyle = '#000'
      ctx.beginPath()
      ctx.moveTo(cx, PARAMS.HEIGHT - PARAMS.Y_OFFSET - PARAMS.RADIUS * 2)
      ctx.lineTo(cx, PARAMS.HEIGHT - PARAMS.Y_OFFSET + PARAMS.RADIUS)
      ctx.stroke()
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#000'
      ctx.fillText(i, cx - 2.5, PARAMS.HEIGHT - PARAMS.Y_OFFSET + PARAMS.RADIUS + 10)
      ctx.closePath()
    }
    ctx.fillStyle = i === parseInt(x.value) ? '#00f' : '#f00'
    ctx.beginPath()
    ctx.arc(cx, cy + PARAMS.RADIUS + PARAMS.Y_OFFSET, PARAMS.RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}

function updateValues () {
  nValue.value = n.value
  pValue.value = p.value
  xValue.value = x.value
  const eValue = n.value * p.value
  const varValue = eValue * (1 - p.value)
  const probValue = probability(n.value, p.value, x.value)
  prob.textContent = `= ${(probValue * 100).toFixed(2)}%`
  e.textContent = `= ${eValue.toFixed(3)}`
  varianza.textContent = `= ${varValue.toFixed(3)}`
}

canvasDPI(PARAMS.WIDTH, PARAMS.HEIGHT, canvas, true)
nMax.value = n.max
x.max = n.max
xValue.value = n.value
updateValues()

// max input
nMax.addEventListener('input', () => {
  let value = (nMax.value || 0)
  if (value > 170) value = 170
  if (value < 1) value = 1
  n.max = value
  x.max = value
  if (x.value > n.max) x.value = n.max
  n.value = n.max
  updateValues()
  draw()
})

// max input blur
nMax.addEventListener('blur', () => {
  nMax.value = n.max
})

// ranges
n.addEventListener('input', () => {
  x.max = n.value
  updateValues()
  draw()
})
p.addEventListener('input', () => {
  p.step = 0.01
  updateValues()
  draw()
})
x.addEventListener('input', () => {
  updateValues()
  draw()
})

nValue.addEventListener('change', () => {
  let value = Math.floor(nValue.value)
  if (value > 170) {
    value = 170
    nValue.value = 170
  }
  if (value >= 0) {
    if (value > n.max) {
      n.max = value
      nMax.value = n.max
    }
    n.value = value
    x.max = value
  }
  updateValues()
  draw()
})

pValue.addEventListener('change', () => {
  if (pValue.value >= 0 && pValue.value <= 1) {
    const factor = 10 ** (-(pValue.value.toString().length - 2))
    p.step = factor
    p.value = pValue.value
  }
  updateValues()
  draw()
})

xValue.addEventListener('change', () => {
  let value = Math.floor(xValue.value)
  if (value > n.max) {
    value = n.max
    xValue.value = n.max
  }
  if (value >= 0) {
    x.value = value
  }
  updateValues()
  draw()
})

draw()
