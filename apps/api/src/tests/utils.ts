import jwt from 'jsonwebtoken'

import { env } from '@/env'
import { faker } from '@/tests/faker'

export function getAuthToken(data?: Partial<TokenOperator>) {
  const payload: TokenOperator = {
    id: 1,
    name: 'Operator',
    roles: [],
    ...data,
  }

  return jwt.sign(payload, env.APP_SECRET, { expiresIn: '24h' })
}
