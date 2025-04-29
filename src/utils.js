export const $ = sel => document.querySelector(sel)

export function canvasDPI (width, height, canvas, scale = false) {
  const ratio = window.devicePixelRatio
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  scale && canvas.getContext('2d').scale(ratio, ratio)
}

/**
 * Verifica que obj sea instancia de type y lo retorna con el tipo correcto.
 * @template T
 * @param {unknown} obj - Objeto a verificar
 * @param {new(...args:any[]) => T} type - Constructor de la clase esperada
 * @returns {T}
 */
export function checkInstance (obj, type) {
  if (!(obj instanceof type)) {
    throw new Error('No se encontro el ' + type.name)
  }
  return obj
}
