
const Database = require('better-sqlite3');

const db = new Database('./models/identifier.sqlite', { verbose: console.log });

module.exports = db;