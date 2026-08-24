// Authentication Endpoint Handler for RUHI PERFUMES Admin
const { validateCredentials, createSessionToken, verifyAdminSession, setSessionCookie, clearSessionCookie } = require('../lib/auth');

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || (req.body ? req.body.action : null);

  if (req.method === 'GET' || action === 'check') {
    const isAuthenticated = verifyAdminSession(req);
    return res.status(200).json({ authenticated: isAuthenticated });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const reqAction = action || body.action;

    if (reqAction === 'logout') {
      clearSessionCookie(res);
      return res.status(200).json({ success: true, message: 'Logged out successfully' });
    }

    // Default to Login Action
    const { username, password } = body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    if (validateCredentials(username, password)) {
      const token = createSessionToken(username);
      setSessionCookie(res, token);
      return res.status(200).json({ success: true, token, message: 'Authenticated successfully' });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid admin username or password.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
