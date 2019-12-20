
# WhatsApp through TwiML
A simple Node app that 


## Getting started

- Clone repo
- Copy **.env.sample** to **.env** and populate your Twilio account details 
- `yarn` to install the dependencies
- `yarn start` to start the server locally
- Create Postman or Curl request to the server url, example:
```
curl -X POST http://localhost:1337/initiate-wa  \
--data-urlencode "to=whatsapp:+31XXXXXXXX" \
--data-urlencode "from=whatsapp:+1XXXXXXXXX" 
```

