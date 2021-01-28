/*
TWITTER BOT

Piero Orderique
28 Jan 2021

This program was created as a learning project folllowing the CodingTrain
on YT. I have updated the program to send me emails every now and then on
a topic of my choice that it reads from using the twitter API
*/

console.log("Twitter bot is starting...\n")
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
        console.log('Email sent: ' + info.response);
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
        count: numberOfResults,
    }
    T.get('search/tweets', params, gotData);
    function gotData(err, data, response) {
        var tweets = data.statuses // list of statuses
        all_tweets = ''
        for(var tweet of tweets) {
            console.log(tweet.user.screen_name + ':\n' + tweet.text + "\n-----------------------")
            all_tweets += tweet.user.screen_name + ':\n' + tweet.text + "\n----------------------\n"
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
    if(err) { console.log("Couldn't Tweet! Error: " + err);
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
var topic = 'stocks'
var numberOfResults = 10
var TIME_CYCLE = 1000*60*60*12

function mailAndTweet(firstTime=false) {
    getTweet(topic)
    if(firstTime) { 
        var r = 1000 + Math.floor(Math.random()*1000)
        sendMail("TWEET BOT INITIATED") 
        tweetIt("My twitter bot " + r + " just started!")
    } else {
        sendMail("Recent Tweets on " + topic + ":\n\n" + all_tweets)
        // tweetIt(all_tweets.substring(0, 120) + '...') // NOT allowed auto RT trending topics!
    }
    console.log("===============================================\n")
}

mailAndTweet(true)
setInterval(mailAndTweet, TIME_CYCLE)

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