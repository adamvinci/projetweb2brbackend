const express = require('express');
const { login, register, readOneFromUserName } = require('../models/users')

const router = express.Router();

/* GET users listing. */
router.post('/login', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;
  if (!username || !password) return res.sendStatus(400)

  const user = await login(username, password);

  if (!user) return res.sendStatus(401);

  createCookieSessionData(req, user);

  return res.json({ username: user.username });
});

router.post('/register', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;
  if (!username || !password) return res.sendStatus(400)
  const newUser = await register(username, password);
  if (!newUser) return res.sendStatus(401);
  createCookieSessionData(req, newUser);

  return res.json({ username: newUser.username });
});

router.post('/loginAnonyme', (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  if (!username) return res.sendStatus(400)
  const newUser = readOneFromUserName(username);
  if (newUser) return res.sendStatus(401);

  return res.json({ usernam: username });
});

router.get('/logout', (req, res) => {
  req.session = null;
  return res.sendStatus(200);
});

function createCookieSessionData(req, authenticatedUser) {
  req.session.username = authenticatedUser.username;
  req.session.token = authenticatedUser.token;
  req.session.user_id = authenticatedUser.id_user
}
module.exports = router;