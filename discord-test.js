const Discord = require('discord.js');
const client = new Discord.Client();
var users = [{
  'user' : null
}];
/*------------------ Kailas ------------------*/




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
//  console.log(obj);
  canCall = true;
  if(toBeHandled.length > 0){
    analyzeMsg(null);
  }
  obj.data.msg.reply(`Hello ${obj.data.msg.author.username}\n Your message has a ${obj.sentiment} sentiment`);
//  console.log(`length: ${users.length}, index: ${obj.data.userIndex}`);
  switch (obj.sentiment) {
    case NEGATIVE:
      users[obj.data.userIndex].negativeCount++;
      console.log(`negativeCount : ${users[obj.data.userIndex].negativeCount}, ${obj.data.msg.author.username}`)
      break;
    case POSITIVE: 
      users[obj.data.userIndex].positiveCount++; 
      console.log(`positiveCount : ${users[obj.data.userIndex].positiveCount}, ${obj.data.msg.author.username}`)
      break;
  }
}

//pass string of msg to be eval **DO NOT CALL DIRECTLY**
function evalMsg(msg){
  params.Text = msg;
  comprehend.detectSentiment(params, function(err, data) {
//    if (err) console.log(err, err.stack);// an error occurred
//    else     console.log(data);           // successful response
    toBeHandled[0].sentiment = data.Sentiment;
    handleSentiment(toBeHandled.shift());
  });
}

//make request to analyze msg
var analyzeMsg = (msg, data) => {
  if(msg != null){
    toBeHandled.push({msg:msg,data:data,sentiment:null});
  }
  if(canCall){
    canCall = false;
    evalMsg(toBeHandled[0].msg);
  }
}







/*-------------------- Patrick ----------------------*/

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//client.on('message', msg => {
//  var add = true; 
//  for(var i = 0; i < users.length; i++) 
//    if(msg.author == users[i].user) add = false;
//  if(add) users.push({
//    'user' : msg.author,
//    'postiveCount' : 0,
//    'negativeCount' : 0
//  });
////  if (msg.content.toUpperCase() === 'HELLO') {
//    msg.reply(`Hello ${users[1].user.username}`);
////  }
//});
client.on('message', msg => {
  if(msg.author.id != client.user.id){
  var add = true; 
  var userIndex = 0;
  for(var i = 0; i < users.length; i++) 
    if(msg.author == users[i].user){
      add = false;
      userIndex = i;
    }
  if(add) {
    users.push({
      'user' : msg.author,
      'positiveCount' : 0,
      'negativeCount' : 0
    });
    userIndex = users.length -1 ;
  }
//  console.log(`Index-original: ${userIndex}`);
  analyzeMsg(msg.content, {
    'msg' : msg,
    'userIndex' : userIndex
  });}
});
client.login('NDMyMjYxMDY2Mjc4NTY3OTM3.DarAYw.xSH0RqyhZ1vOWbiIWBjBCsF-TPU');


