
# WhatsApp through TwiML
A Node app that takes a set of messages to send to a WA user, and has some logic to handle responses. It maintains a simple state of each participant and keeps their state in memory.

## Getting started

- Clone repo
- Copy **.env.sample** and rename to **.env** and populate your Twilio account details 
- `yarn` to install the dependencies
- `yarn start` to start the server locally or `yarn start-dev` to start with autoreload enabled using **nodemon**
- Install and run `ngrok` to expose the local server port, so that Twilio can send webhooks to it:
  `./ngrok http 1337`
- Configure Incoming Messages webhook in Twilio to point to the URL from the previous command. (Programmable SMS -> Whatsapp -> Sandbox -> "When a message comes in").

Test
- Create a web request in Postman or Curl to the server url, example:
```
curl -X POST http://localhost:1337/initiate-wa  \
--data-urlencode "to=whatsapp:+31XXXXXXXX" \
--data-urlencode "from=whatsapp:+1XXXXXXXXX" 
```
- You can also simulate user responses by sending to `/incoming-wa` or you can just reply in WhatsApp and the configured webhook will send messages to your server

*Note: if stopping and starting ngrok, the URL may change and you would need to update it in Twilio.

## API

`/initiate-wa` - trigger to send initial message to WhatsApp user

`/incoming-wa` - responses received from WhatsApp user are sent to this endpoint


## ToDo:
- Add parameter handling 
- Add validation for Twilio signature on every inbound message 
