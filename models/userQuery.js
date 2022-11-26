
const db = require('./db_conf');

module.exports.save = (data) => {
    const stmt = db.prepare('INSERT INTO users(login, password) VALUES (?, ?)');
    stmt.run(data.username, data.password);

}

module.exports.find = (username) => {
    db.prepare('SELECT * FROM users WHERE login = ?').get(username);
}

module.exports.list = () => db.prepare("SELECT * FROM users").all();