import * as jwt from 'jsonwebtoken';

export const generateToken = (payload: any, secret: string): string => {
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

export const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null
  }
}