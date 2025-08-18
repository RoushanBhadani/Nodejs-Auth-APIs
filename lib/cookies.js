// lib/cookies.js
import { serialize } from 'cookie';

export function setAuthCookie(res, token) {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const cookie = serialize('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 60 // 1 hour
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearAuthCookie(res) {
  const cookie = serialize('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 0
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getTokenFromRequest(req) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (auth && typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length);
  }
  const cookieHeader = req.headers['cookie'];
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, ...v] = c.trim().split('=');
    return [decodeURIComponent(k), decodeURIComponent(v.join('='))];
  }));
  return cookies.token || null;
}
