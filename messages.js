

const mes = {
  m1:{
    text:"Hello and welcome to SpruceChat",
    next:"q1"
  },
  q1:{
    text:"Hello and welcome to SpruceChat.\n Let's start with your name. How would you like to be addressed?",
    condition: "reply",
    next:"q2",
  },
  q2:{
    text:"Great, thanks. How do you like this picture?",
    condition: "reply",
    action: "http://dog.ceo/api/breeds/image/random",
    next: "m2"
  },
  m2:{
    text:"Nice, have a good day"
  }
}



module.exports =  mes;
