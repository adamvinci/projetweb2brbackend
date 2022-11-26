const db = require('./db_conf');

module.exports.list = (userId) => db.prepare("SELECT * FROM messages WHERE user_ = ?").all(userId);

module.exports.saveUserMessage=(data)=>{
    const stmt=db.prepare('INSERT INTO messages (user_,type,content) VALUES (?,?,?)');
    stmt.run(data.user_id,data.type,data.content);
 
}

module.exports.saveVisitorMessage=(data)=>{
    const stmt=db.prepare('INSERT INTO messages (type,content) VALUES (?,?)');
    stmt.run(data.type,data.content);
  
}

module.exports.deleteOneFilm=(id) => db.prepare('DELETE FROM messages WHERE id_message = ?').run(id)
 