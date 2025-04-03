const memo = {}
export function factorial (n) {
  if (n < 0) return n
  if (memo[n] !== undefined) return memo[n]
  memo[n] = n <= 1 ? 1 : n * factorial(n - 1)
  return memo[n]
}

export function probability (n, p, k) {
  const comb = factorial(n) / (factorial(k) * factorial(n - k))
  const rp = Math.pow(p, k)
  const rq = Math.pow(1 - p, n - k)
  return comb * rp * rq
}
