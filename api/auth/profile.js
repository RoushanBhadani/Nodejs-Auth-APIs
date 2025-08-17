import { connectToDB } from '../../lib/db.js';
import User from '../../models/User.js';
import { getTokenFromRequest } from '../../lib/cookies.js';
import { verifyToken } from '../../lib/jwt.js';
import { ok, unauthorized, methodNotAllowed, serverError } from '../_utils/respond.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const token = getTokenFromRequest(req);
    if (!token) return unauthorized(res, 'Missing token');

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return unauthorized(res, 'Invalid or expired token');
    }

    await connectToDB();
    const user = await User.findById(payload.sub).lean();
    if (!user) return unauthorized(res, 'User not found');

    return ok(res, {
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }, 'Profile fetched');
  } catch (err) {
    return serverError(res, err);
  }
}
