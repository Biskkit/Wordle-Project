const fs = require('fs');
const path = require('path');
const express = require('express');
const oneDay = 1000 * 60 * 60 * 24;
const cors = require('cors');

const app = express();
const PORT = 5000;

// Set up cors since app and server are on different ports
app.use(cors());
// Initialize validGuesses and correct words

// Valid guesses list was taken from github.com/tabatkins/wordle-list
const guesses = fs.readFileSync(path.join(__dirname, "guesses.txt"), 'utf-8').split('\n').map(line => line.trim());

// Answers list was taken from https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b#file-wordle-answers-alphabetical-txt-L8
const answers = fs.readFileSync(path.join(__dirname, "answers.txt"), 'utf-8').split('\n').map(line => line.trim());
// Make set out of answers for O(1) lookup
const answersSet = new Set(answers);


// Sanity check that guesses list contains all answers
// const guessSet = new Set(validGuesses);
// const missing = answers.filter(word => !guessSet.has(word));

// Functions for each endpoint
function getWordOfDay(req, res) {
	// Find today's date
	const now = Date.now();
	// Floor to nearest day integer
	now /= oneDay;
	now = Math.floor(now);
	// Find remainder to index into answers list
	now = now % answers.length;
	// Return word found
	res.send(answers[now]);
}

/* Validates word in req.params.word, returning true if valid, false if not */
function validateWord(req, res) {
	// Grab word from params
	let word = req.params.word;
	// See if word is in word set
	if(answersSet.has(word.toLowerCase())) {
		res.send(true);
	}
	else {
		res.send(false);
	}
}

// Set word route, simply grabs word of the day
app.get('/word', getWordOfDay);

// Set validate route, takes in word, and validates it if it's in the dictionary.
app.get('/validate/:word', validateWord)

