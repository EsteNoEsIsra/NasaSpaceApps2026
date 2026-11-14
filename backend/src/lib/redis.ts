import Redis from 'ioredis'

const redis = new Redis({
  host:     process.env.REDIS_HOST ?? 'redis',
  port:     Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
})

redis.on('error', (err) => console.error('Redis error:', err))

export default redis

/** Cache helper — get or compute */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const hit = await redis.get(key)
  if (hit) return JSON.parse(hit) as T
  const value = await fn()
  await redis.setex(key, ttlSeconds, JSON.stringify(value))
  return value
}
