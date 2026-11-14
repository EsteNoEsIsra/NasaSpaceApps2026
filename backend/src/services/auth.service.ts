import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { users } from '../db/schema'
import { signToken } from '../lib/jwt'

export class AuthService {
  async register(body: { name: string; email: string; password: string }) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    })
    if (existing) throw new Error('Email already in use')

    const hashed = await bcrypt.hash(body.password, 12)
    const [user] = await db
      .insert(users)
      .values({ name: body.name, email: body.email, password: hashed })
      .returning({ id: users.id, email: users.email, name: users.name, role: users.role })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    return { user, token }
  }

  async login(body: { email: string; password: string }) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    })
    if (!user) throw new Error('Invalid credentials')

    const valid = await bcrypt.compare(body.password, user.password)
    if (!valid) throw new Error('Invalid credentials')

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    }
  }
}
