// api/_utils/respond.js

const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8081';

function setCommonHeaders(res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
}

export function preflight(req, res) {
  if (req.method === 'OPTIONS') {
    setCommonHeaders(res);
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

export function json(res, status, body) {
  setCommonHeaders(res);
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

export function methodNotAllowed(res, methods = ['POST']) {
  res.setHeader('Allow', methods.join(', '));
  return json(res, 405, { success: false, message: `Method not allowed. Use: ${methods.join(', ')}` });
}

export function ok(res, data = {}, message = 'OK') {
  return json(res, 200, { success: true, message, data });
}

export function created(res, data = {}, message = 'Created') {
  return json(res, 201, { success: true, message, data });
}

export function badRequest(res, message = 'Bad Request', details) {
  return json(res, 400, { success: false, message, details });
}

export function unauthorized(res, message = 'Unauthorized') {
  return json(res, 401, { success: false, message });
}

export function conflict(res, message = 'Conflict') {
  return json(res, 409, { success: false, message });
}

export function serverError(res, err) {
  console.error(err);
  return json(res, 500, { success: false, message: 'Internal Server Error' });
}
