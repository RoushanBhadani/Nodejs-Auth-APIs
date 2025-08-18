// api/auth/login.js
import { connectToDB } from '../../lib/db.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import { loginSchema } from '../../lib/validate.js';
import { signToken } from '../../lib/jwt.js';
import { setAuthCookie } from '../../lib/cookies.js';
import { ok, badRequest, unauthorized, methodNotAllowed, serverError, preflight } from '../_utils/respond.js';

export default async function handler(req, res) {
  if (preflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(res, 'Validation failed', parsed.error.flatten());
    }

    const { email, password } = parsed.data;
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) return unauthorized(res, 'Invalid credentials');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return unauthorized(res, 'Invalid credentials');

    const token = signToken({ sub: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    return ok(res, {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    }, 'Login successful');
  } catch (err) {
    return serverError(res, err);
  }
}

