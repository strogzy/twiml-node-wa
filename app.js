const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(accountSid, authToken);

const messages = require('./messages');



const app = express();
app.use(express.json());
app.use(express.urlencoded());

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming tomorrow! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.post('/initiate-wa', (req, res)=> {
  console.log(req.body);
  if (!req.body.to || !req.body.from){
    res.status(400);
    res.send("Bad request");
    return
  }
  const num_to = req.body.to;
  const num_from = req.body.from;
  res.send("Request accepted");

  twilio.messages
  .create({
     body: messages.m1.text,
     from: num_from.toString(),
     to: num_to.toString()
   })
  .then(message => console.log(message));
});




http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
