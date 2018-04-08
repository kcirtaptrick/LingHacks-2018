var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

//constants for sentiment response
const NEGATIVE='NEGATIVE',NEUTRAL='NEUTRAL',MIXED='MIXED',POSITIVE='POSITIVE';

var comprehend = new AWS.Comprehend();
var params = {
  LanguageCode: 'en'
};

var toBeHandled = [];
var canCall = true;

var handleSentiment = (obj) => {
  //handle consequences to user
  //obj = {msg:msg,user:{},sentiment:"SENTIMENT"}
  console.log(obj);
  canCall = true;
  if(toBeHandled.length > 0){
    analyzeMsg(null);
  }
}

//pass string of msg to be eval **DO NOT CALL DIRECTLY**
function evalMsg(msg){
  params.Text = msg;
  comprehend.detectSentiment(params, function(err, data) {
    if (err) console.log(err, err.stack);// an error occurred
    else     console.log(data);           // successful response
    toBeHandled[0].sentiment = data.Sentiment;
    handleSentiment(toBeHandled.shift());
  });
}

//make request to analyze msg
var analyzeMsg = (msg, user) => {
  if(msg != null){
    toBeHandled.push({msg:msg,user:user,sentiment:null});
  }
  if(canCall){
    canCall = false;
    evalMsg(toBeHandled[toBeHandled.length-1].msg);
  }
}


//example
analyzeMsg("fuck off",{name:"a name",info:"info"});
analyzeMsg("you're sweet",{name:"a name",info:"info"});
analyzeMsg("hi",{name:"a name",info:"info"});
analyzeMsg("awesome!!",{name:"a name",info:"info"});
analyzeMsg("that's cute",{name:"a name",info:"info"});
