const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userQuery = require("./userQuery");

const jwtSecret = 'ilovemybelgium!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;



async function login(username, password) {
  const userNameFound = readOneFromUserName(username);
  console.log(userNameFound)
  if (!userNameFound) return undefined;
  const comparatorPassword = await bcrypt.compare(password, userNameFound.password)

  if (!comparatorPassword) return undefined;

  const token = jwt.sign(
    { username },
    jwtSecret,
    { expiresIn: lifetimeJwt },
  );

  const authenticatedUser = {
    id_user: userNameFound.id_user,
    username: userNameFound.login,
    token,
  };

  return authenticatedUser;

}

async function register(username, password) {
  const userNameFound = readOneFromUserName(username);
  if (userNameFound) return undefined;
  await createUser(username, password);

  const token = jwt.sign(
    { username },
    jwtSecret,
    { expiresIn: lifetimeJwt },
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const data = {
    username,
    password: hashedPassword,
  }
  const newUser = userQuery.save(data)
  return newUser;

}

function readOneFromUserName(username) {
  const users = userQuery.find(username)
  if (!users) return undefined;
  return users;
}

module.exports = { login, register, readOneFromUserName }