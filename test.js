var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

//constants for sentiment response
const NEGATIVE='NEGATIVE',NEUTRAL='NEUTRAL',MIXED='MIXED',POSITIVE='POSITIVE';

var comprehend = new AWS.Comprehend();
var params = {
  LanguageCode: 'en'
};

//pass string of msg to be evaled
function evalMsg(msg){
  params.Text = msg;
  comprehend.detectSentiment(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    switch(data.Sentiment){
      case NEGATIVE:
        console.log("you get a warning");
        break;
      case POSITIVE:
        break;
      case MIXED:
        break;
      case NEUTRAL:
        break;
      default:
        break;
    }
  });
}

evalMsg("every thing is the worst");
