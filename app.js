const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(accountSid, authToken);
const request = require('request');
var rp = require('request-promise');

const messages = require('./messages');

var sessions = [
/* {
    cust:"+1XXXXXXX",
    stage:"m1",
   }
*/
];

function newSession(cust){
  sessions.push({cust: cust, stage:'m1'});
  let newC = sessions[sessions.length-1];
  console.log("current sessions", sessions, newC);
  return newC
}

function getCustomer(cust){
  for (let i=0; i<sessions.length; i++) {
    if (cust == sessions[i].cust){
      console.log("found ", sessions[i]);
      return sessions[i]
    }
  };
  let newCust = newSession(cust);
  console.log("created new ", newCust);
  return newCust
}

function updateCustomer(cust){
  sessions.forEach(session =>{
    if (cust == session.cust){
      console.log("found", session);
      if (messages[session.stage].next){
        session.stage = messages[session.stage].next;
      }
      return session
    }
  })
  return -1
}


const app = express();
app.use(express.json());
app.use(express.urlencoded());


function checkStage(stage, msg){
  if (messages[stage].req){
    // at the moment, if any response is received, we treat it as req passed
    // later we can add different checks to make sure req is satisfied
    console.log(`received "${msg}" in response to ${messages[stage].text}`);
    return true
  }
  else if(!messages[stage].req){
    console.log("no conditions");
    return true
  }
  console.log("returning false");
  return false
}

function addStage(stage){

}

async function createMsg(stage){
  let resp = {};
  resp.text = messages[stage].text;

  if (messages[stage].action){
    return rp({uri:messages[stage].action, json:true}) 
    .then((res)=> {
      console.log("res: ",res);
      resp.action = res.message;
      return resp;
      })
  }
  else {
    return resp;
  }

}

app.post('/incoming-wa', (req, res)=>{
  let customer = getCustomer(req.body.From);

  let respBody, respMedia;
  let next = messages[customer.stage].next;
  
  const twiml = new MessagingResponse();

  let pass = checkStage(customer.stage, req.body.body);
  let nm;
  if (pass){
    updateCustomer(customer.cust);
    
    createMsg(customer.stage)
    .then(resp=>{
      console.log("retrieved extra info: ",resp);
      nm = twiml.message(resp.text);
      if (resp.action) { nm.media(resp.action)}
    })
    .finally(()=>{

      console.log("twiml: ", twiml.toString());
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      res.end(twiml.toString());
    })
  } else {
    console.log("current sessions:", customer);
    console.log("twiml: ", twiml.toString());
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }

});




app.post('/initiate-wa', (req, res)=> {
  if (!req.body.to || !req.body.from){
    res.status(400);
    res.send("Bad request");
    return
  }
  const num_to = req.body.to;
  const num_from = req.body.from;
  res.send("Request accepted");

  getCustomer(num_to);

  twilio.messages
  .create({
     body: messages.q1.text,
     from: num_from.toString(),
     to: num_to.toString()
   })
  .then(message => console.log(message));
});




http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
