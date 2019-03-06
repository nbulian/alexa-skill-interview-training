'use strict';
const Alexa = require('alexa-sdk');

var module = require("./module.js");
var questions = module.questions();
var greeting = module.greeting();

let initialSound = "<audio src='soundbank://soundlibrary/home/amzn_sfx_doorbell_chime_01'/>";
let questionSound = "<audio src='soundbank://soundlibrary/musical/amzn_sfx_electronic_major_chord_01'/>";
let lastQuestion = null;
let welcomeOutput = 'Welcome to Interview Training';
let welcomeReprompt = "Do you want to start your training session?";
let speechOutput;
let reprompt;

const handlers = {
    'LaunchRequest': function () {
        //Se ejecuta cuando el usuario dice "Alexa, open interview training"
        console.log('session started!');
        this.emit(':ask', initialSound + welcomeOutput + ', ' + welcomeReprompt, welcomeReprompt);
    },
    'AskQuestionIntent': function () {
        //Se ejecuta cuando el usuario dice "Alexa, ask Interview Training to ask me questions"
        console.log('new question');
        speechOutput = randomPhrase(questions);
        lastQuestion = speechOutput;
        this.emit(':ask', questionSound + speechOutput);
    },
    'RepeatQuestionIntent': function () {
        //Se ejecuta cuando el usuario dice "Alexa, repeat the question"
        this.emit(':ask', questionSound + lastQuestion);
    },
    'AMAZON.NoIntent': function() {
        speechOutput = 'Ok, see you next time!';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        //Se ejecuta cuando el usuario dice "Help"
		speechOutput = 'This skill will return a random example interview question. You can say, ask me a question, repeat the question, or, next question';
		reprompt = 'Ask me for questions and practice before your big day!';
		this.emit(':ask', speechOutput, reprompt);
        this.response.shouldEndSession(false);
        //this.response.listen();

    },
    'AMAZON.CancelIntent': function () {
        //Se ejecuta cuando el usuario dice "Cancel"
        speechOutput = 'Sure, no problem';
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function () {
        //Se ejecuta cuando el usuario dice "Stop"
        speechOutput = randomPhrase(greeting);
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
    },
    'Unhandled': function () {
        //Se ejecuta cuando el usuario dice "Stop"
        speechOutput = 'Sorry, I didn\'t get that. Try again.';
        reprompt = 'Try saying, new question.';
        this.emit(':tell', speechOutput, reprompt);
    },
    
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}