var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var params = {
  LanguageCode: "en", /* required */
  Text: 'I love you?' /* required */
};
var comprehend = new AWS.Comprehend();
comprehend.detectSentiment(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
