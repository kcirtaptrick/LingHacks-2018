var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

//constants for sentiment response
const NEGATIVE='NEGATIVE',NEUTRAL='NEUTRAL',MIXED='MIXED',POSITIVE='POSITIVE';

var comprehend = new AWS.Comprehend();
var params = {
  LanguageCode: 'en'
};

var toBeHandled = [];

//pass string of msg to be eval **DO NOT CALL DIRECTLY**
function evalMsg(msg){
  params.Text = msg;
  comprehend.detectSentiment(params, function(err, data) {
    if (err) console.log(err, err.stack);// an error occurred
    else     console.log(data);           // successful response

    for (msg of toBeHandled) {
      if(msg.sentiment == null){
        msg.sentiment = data.Sentiment;
        handleSentiment(toBeHandled.pop());
        break;
      }
    }

  });
}

var handleSentiment = (obj) => {
  //handle consequences to user
  //obj = {msg:msg,user:{},sentiment:"SENTIMENT"}
  console.log(obj);
}

//make request to analyze msg
var analyzeMsg = (msg, user) => {
  toBeHandled.push({msg:msg,user:user,sentiment:null});
  evalMsg(msg);
}

analyzeMsg("fuck off you little bitch McBitchFace",{name:"a name",info:"info"});
