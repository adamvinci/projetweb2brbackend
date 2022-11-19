const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('node:path');
const { parse, serialize } = require('../utils/json');

const jwtSecret = 'ilovemybelgium!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');

const defaultUser=[
{
    id:0,
    username:'default',
    password:'default',
    isAdmin:0,

},

];

async function login(username,password){
    const userNameFound=readOneFromUserName(username);
    if(!userNameFound) return undefined;
   
    const comparatorPassword= await bcrypt.compare(password,userNameFound.password)

    if(!comparatorPassword) return undefined;
  
    const token = jwt.sign(
        { username }, 
        jwtSecret, 
        { expiresIn: lifetimeJwt }, 
      );
    
      const authenticatedUser = {
        username:userNameFound.username,
        token,
      };
   
      return authenticatedUser;

}

async function register(username,password){
    const userNameFound=readOneFromUserName(username);
    if(userNameFound) return undefined;
    await createUser(username,password);

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
async function createUser(username,password){
    const users=parse(jsonDbPath,defaultUser)
    const hashedPassword=await bcrypt.hash(password,saltRounds);
    const newUser={
        id:getNextId(),
        username,
        password:hashedPassword,
        isAdmin:0
    }
    users.push(newUser);
    serialize(jsonDbPath,users)
    return newUser;

}

function getNextId() {
    const users = parse(jsonDbPath, defaultUser);
    const lastItemIndex = users?.length !== 0 ? users.length - 1 : undefined;
    if (lastItemIndex === undefined) return 1;
    const lastId = users[lastItemIndex]?.id;
    const nextId = lastId + 1;
    return nextId;
  }

function readOneFromUserName(username){
    const users=parse(jsonDbPath,defaultUser);
    const indexUserFound=users.findIndex((user)=>user.username===username);

    if(indexUserFound<0) return undefined;
    return users[indexUserFound];
}

module.exports={login,register,readOneFromUserName}