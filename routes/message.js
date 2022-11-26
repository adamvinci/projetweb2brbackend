/* eslint-disable */
const express = require('express');

const router = express.Router();

const Message=require('../models/messages')

router.get('/', (req, res) => {
    console.log(Message.list(req.session.user_id))
  return res.json({message:Message.list(req.session.user_id)})

});


router.post('/addMessageUser', (req, res) => {
    const user_id=req.session.user_id;
    const content=req.body.content
    const type=req.body.type
    const data={user_id,type,content}

  return res.json({newMessage:Message.saveUserMessage(data)})

});

router.post('/addMessageVisitor', (req, res) => {
    const content=req.body.content
    const type=req.body.type
    const data={type,content}

  return res.json({newMessage:Message.saveVisitorMessage(data)})

});

router.delete('/:id', (req,res) => {
  console.log("delete")
  const idMessage=req?.params?.id
const message=Message.list(req.session.user_id)
let del=false;

Array.from(message).forEach(element => {
  if(element.id_message=idMessage){
  Message.deleteOneFilm(idMessage)
del=true;
  }
});

    if(!del){return res.sendStatus(401)}
  

});

module.exports = router;
