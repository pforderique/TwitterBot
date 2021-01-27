/*
Twit is apparantely outdated since Twitter updated their API

However, for the puposes of the project, 
    which is notify somehow everytime to get Elon Musk tweets eve
*/

console.log("bot is starting...")

// ---------------- SUCCESSFULLY USED RANDOM JOKE API! -----------------
let url = "https://official-joke-api.appspot.com/random_joke"
let importedJSON;
let joke;
let request = require('request');

// Random joke API Call
function getNewJoke(){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            importedJSON = JSON.parse(body);
            joke = importedJSON.setup + "\n" +importedJSON.punchline
            console.log(joke);
        }
    });
}
// -------------------- NODE MAILER ----------------------
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport('./myinfo/gmailconfig');
console.log(transporter)

// ---------------- Twitter API Examples! -----------------
var Twit = require('twit')
var config = require('./myinfo/config')
var T = new Twit(config)

/* What can I do?
    get() - search? by hastag, location, usr, etc
    post() - tweeting!
    stream() - @mention
*/

// get tweets! //
function getTweet() {
    var params = {
        q:'rainbow', //'banana since:2011-11-11',
        count: 2,
    }
    T.get('search/tweets', params, gotData);
    function gotData(err, data, response) {
        var tweets = data.statuses // list of statuses
        for(var tweet of tweets) {
            console.log(tweet.text)
        }
    }
}

// general tweet txt //
function tweetIt(txt) {
    // var r = 1000 + Math.floor(Math.random()*1000)
    var tweet = { status: txt, }
    T.post('statuses/update', tweet, tweeted);
}
// helper function to see if tweet went through
function tweeted(err, data, response) {
    if(err) { console.log("Something went wrong!");
    } else { console.log("Tweet Sent!") }
}
// tweet JOKE
function tweetNewJoke() {
    getNewJoke()
    tweetIt(joke)
}

// How to set interval tweets...
// tweetNewJoke();
// setInterval(tweetNewJoke, 1000*10);

// Set up user stream (does not work)
    // var stream = T.stream('statuses/filter', { track: '@JakeOwe63612049' });
    // // Activate anytime someone follows
    // // stream.on('follow', tweetThanks)
    // // def what you want to have happen
    // function tweetThanks(eventMsg) {
    //     console.log("Someone Followed!")
    //     var name = eventMsg.source.name;
    //     var screenName = eventMsg.source.screen_name;

    //     var tweet = {
    //         status: 'Thanks @' + screenName + ' for the follow!'
    //     }
    //     T.post('statuses/update', tweet, tweeted);
    // }