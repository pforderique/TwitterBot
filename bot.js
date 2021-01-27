/*
Twit is apparantely outdated since Twitter updated their API

However, for the puposes of the project, 
    which is notify somehow everytime to get Elon Musk tweets eve
*/

console.log("bot is starting...\n")
// ---------------- SUCCESSFULLY USED RANDOM JOKE API! -----------------
let url = "https://official-joke-api.appspot.com/random_joke"
let joke;
let importedJSON;
let all_tweets;
let request = require('request');

// Random joke API Call
function getNewJoke(){
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            importedJSON = JSON.parse(body);
            joke = importedJSON.setup + "\n" + importedJSON.punchline
            console.log("NEW JOKE: \n" + joke);
        }
    });
}
// --------------------- NODE MAILER ----------------------
var nodemailer = require('nodemailer')
var gmailconfig = require('./myinfo/gmailconfig')
var transporter = nodemailer.createTransport(gmailconfig);

// general send mail to yourself function
function sendMail(txt) {
    var MAIL_INFO = {
        from: gmailconfig.auth.user,
        to: gmailconfig.auth.user, // send to myself
        subject: 'Twitter Bot Here!',
        text: txt
    };
    transporter.sendMail(MAIL_INFO, emailSent)
}
// helper function
function emailSent(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response + "\n");
    }
}
// email yourself a new joke
function mailJoke(firstTime=false) {
    getNewJoke()
    if(firstTime) {
        sendMail("JOKE BOT INITIATED")
    } else {
        sendMail(joke)
    }
}
//email a new tweets
function mailTweets(firstTime=false) {
    getTweet('stocks')
    if(firstTime) {
        sendMail("TWEET BOT INITIATED")
    } else {
        sendMail(all_tweets)
    }
}

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
function getTweet(topic) {
    var params = {
        q: topic, //'banana since:2011-11-11',
        count: 2,
    }
    T.get('search/tweets', params, gotData);
    function gotData(err, data, response) {
        var tweets = data.statuses // list of statuses
        all_tweets = ''
        for(var tweet of tweets) {
            console.log(tweet.text)
            all_tweets += tweet.text + "\n"
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

// --------------------------- MAIN ----------------------------
// mailJoke(true)
// setInterval(mailJoke, 1000*10)
mailTweets(true)
setInterval(mailTweets, 1000*100)

// ---------------- streaming no long works :( -----------------

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