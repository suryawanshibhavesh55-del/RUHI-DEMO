// Secure Admin Authentication & Session Verification
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
require('dotenv').config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ruhi_admin_2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'ruhi_perfumes_super_secret_jwt_session_key_2026';

function validateCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function createSessionToken(username) {
  return jwt.sign({ username, role: 'admin' }, SESSION_SECRET, { expiresIn: '24h' });
}

function parseCookies(req) {
  const cookieHeader = req.headers ? (req.headers.cookie || req.headers.Cookie || '') : '';
  return cookie.parse(cookieHeader);
}

function verifyAdminSession(req) {
  try {
    const cookies = parseCookies(req);
    const token = cookies.ruhi_admin_session || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');

    if (!token) return false;

    const decoded = jwt.verify(token, SESSION_SECRET);
    return decoded && decoded.role === 'admin';
  } catch (err) {
    return false;
  }
}

function setSessionCookie(res, token) {
  const serialized = cookie.serialize('ruhi_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

function clearSessionCookie(res) {
  const serialized = cookie.serialize('ruhi_admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

module.exports = {
  validateCredentials,
  createSessionToken,
  verifyAdminSession,
  setSessionCookie,
  clearSessionCookie,
};
