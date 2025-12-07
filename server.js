require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const sessions = new Map();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId && sessions.has(sessionId)) {
    return res.redirect('/profile');
  }

  res.render('login', {
    clientId: process.env.GOOGLE_CLIENT_ID
  });
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    clientId: process.env.GOOGLE_CLIENT_ID
  });
});

app.post('/api/login', (req, res) => {
  const { token, userInfo } = req.body;

  if (!token || !userInfo) {
    return res.status(400).json({ error: 'Missing token or user info' });
  }

  const sessionId = Math.random().toString(36).substring(7) + Date.now();

  sessions.set(sessionId, {
    token,
    userInfo,
    createdAt: Date.now()
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ success: true });
});

app.get('/api/user', (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const session = sessions.get(sessionId);
  res.json({ userInfo: session.userInfo });
});

app.post('/api/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  res.clearCookie('sessionId');
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
