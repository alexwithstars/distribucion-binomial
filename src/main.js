import './style.css'
import { PARAMS } from './consts.js'
import { $, canvasDPI } from './utils.js'
import { probability } from './math.js'

const n = $('#n')
if (!(n instanceof window.HTMLInputElement)) throw new Error('No se encontro el input n')
const nMax = $('#nMax')
if (!(nMax instanceof window.HTMLInputElement)) throw new Error('No se encontro el input nMax')
const p = $('#p')
if (!(p instanceof window.HTMLInputElement)) throw new Error('No se encontro el input p')
const nValue = $('#nValue')
if (!(nValue instanceof window.HTMLInputElement)) throw new Error('No se encontro el input nValue')
const pValue = $('#pValue')
if (!(pValue instanceof window.HTMLInputElement)) throw new Error('No se encontro el input pValue')
const e = $('#e')
if (!(e instanceof window.HTMLSpanElement)) throw new Error('No se encontro el span e')
const varianza = $('#var')
if (!(varianza instanceof window.HTMLSpanElement)) throw new Error('No se encontro el span varianza')
const canvas = $('#canvas')
if (!(canvas instanceof window.HTMLCanvasElement)) throw new Error('No se encontro el canvas')
const ctx = canvas.getContext('2d')
if (!(ctx instanceof window.CanvasRenderingContext2D)) throw new Error('No se encontro el contexto 2d')
const usefulHeight = PARAMS.HEIGHT - PARAMS.Y_OFFSET * 2 - PARAMS.RADIUS * 2
const usefulWidth = PARAMS.WIDTH - PARAMS.X_OFFSET * 2 - PARAMS.RADIUS * 2

function draw () {
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

  const gap = usefulWidth / n.value
  for (let i = 0; i <= n.value; i++) {
    const y = (1 - probability(n.value, p.value, i)) * usefulHeight
    const x = PARAMS.X_OFFSET * 2 + gap * i
    if (gap > 18 || i % 10 === 0) {
      ctx.strokeStyle = '#000'
      ctx.beginPath()
      ctx.moveTo(x, PARAMS.HEIGHT - PARAMS.Y_OFFSET - PARAMS.RADIUS * 2)
      ctx.lineTo(x, PARAMS.HEIGHT - PARAMS.Y_OFFSET + PARAMS.RADIUS)
      ctx.stroke()
      ctx.font = '10px sans-serif'
      ctx.fillStyle = '#000'
      ctx.fillText(i, x - 2.5, PARAMS.HEIGHT - PARAMS.Y_OFFSET + PARAMS.RADIUS + 10)
      ctx.closePath()
    }
    ctx.fillStyle = '#f00'
    ctx.beginPath()
    ctx.arc(x, y + PARAMS.RADIUS + PARAMS.Y_OFFSET, PARAMS.RADIUS, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}

function updateValues () {
  nValue.value = n.value
  pValue.value = p.value
  const eValue = n.value * p.value
  const varValue = eValue * (1 - p.value)
  e.textContent = `= ${eValue.toFixed(3)}`
  varianza.textContent = `= ${varValue.toFixed(3)}`
}

canvasDPI(PARAMS.WIDTH, PARAMS.HEIGHT, canvas, true)
nMax.value = n.max
updateValues()

// max input
nMax.addEventListener('input', () => {
  let value = (nMax.value || 0)
  if (value > 170) value = 170
  if (value < 1) value = 1
  n.max = value
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
  updateValues()
  draw()
})
p.addEventListener('input', () => {
  p.step = 0.01
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

draw()
