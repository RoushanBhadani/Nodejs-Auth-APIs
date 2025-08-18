// api/auth/signup.js
import { connectToDB } from '../../lib/db.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import { signupSchema } from '../../lib/validate.js';
import { signToken } from '../../lib/jwt.js';
import { setAuthCookie } from '../../lib/cookies.js';
import { created, badRequest, conflict, methodNotAllowed, serverError, preflight } from '../_utils/respond.js';

export default async function handler(req, res) {
  if (preflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(res, 'Validation failed', parsed.error.flatten());
    }

    const { email, username, password } = parsed.data;
    await connectToDB();

    const exists = await User.findOne({ email }).lean();
    if (exists) return conflict(res, 'Email already registered');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, username, passwordHash });

    const token = signToken({ sub: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    return created(res, {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    }, 'Signup successful');
  } catch (err) {
    if (err?.code === 11000) return conflict(res, 'Email already registered');
    return serverError(res, err);
  }
}
