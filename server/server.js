const fs = require('fs');
const path = require('path');
const express = require('express');
const oneDay = 1000 * 60 * 60 * 24;
const cors = require('cors');

const app = express();
// Process.env.PORT sets it to the port provided by render if there is one
const PORT = process.env.PORT || 5000;

// Set up cors since app and server are on different ports
app.use(cors({
	origin: [process.env.CLIENT_URL],
	methods: ["GET"],
}));

// Initialize validGuesses and correct words
// Valid guesses list was taken from github.com/tabatkins/wordle-list
const guesses = fs.readFileSync(path.join(__dirname, "guesses.txt"), 'utf-8').split('\n').map(line => line.trim());

// Answers list was taken from https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b#file-wordle-answers-alphabetical-txt-L8
const answers = fs.readFileSync(path.join(__dirname, "answers.txt"), 'utf-8').split('\n').map(line => line.trim());
// Make set out of answers for O(1) lookup
const guessesSet = new Set(guesses);


// Sanity check that guesses list contains all answers
// const guessSet = new Set(validGuesses);
// const missing = answers.filter(word => !guessSet.has(word));

// Functions for each endpoint
function getWordOfDay() {
	// Find today's date
	let now = Date.now();
	// Floor to nearest day integer
	now /= oneDay;
	now = Math.floor(now);
	// Find remainder to index into answers list
	now = now % answers.length;
	// Return word found
	return answers[now];
}

/* Validates word in req.params.word, returning true if valid, false if not */
function validateWord(req, res) {
	// Grab word from params
	let word = req.params.word;

	// See if word is in word set
	if(guessesSet.has(word.toLowerCase())) {
		res.send(true);
	}
	else {
		res.send(false);
	}
}

/* Gets colors of word in a string "wwwww", "cwyyc". Where 'w' is for wrong (gray), 'c' is for correct (green), and 'y' is for yellow */
function getColors(req, res) {
	// Grab word from request parameters
	let guessedWord = req.params.word.toLowerCase();
	// console.log("Got word " + guessedWord + "\n");
	// Make word lowercase
	guessedWord = guessedWord.toLowerCase();
	// Grab word of the day and lowercase
	let correctWord =  getWordOfDay().toLowerCase();
	// console.log("Correct word: " + correctWord + "\n");

	if(guessedWord == correctWord) {
		res.send("ccccc");
	}


	// Initialize array of colors
	let colors = Array(5).fill("w");

	// Frequency table for letters
	const lettersCount = {};

	// Initialize freq table
	for(let i = 0; i < 5; i++) {
		lettersCount[correctWord[i]] = (lettersCount[correctWord[i]] || 0) + 1;
	}

	// First, iterate through, checking for words in the correct spot
	for(let i = 0; i < 5; i++) {
		if(guessedWord[i] == correctWord[i]) {
			colors[i] = "c";

			// Decrement count
			lettersCount[guessedWord[i]]--;
		}
	}
	
	// Then, iterate through, checking if each word exists in the correct word. Using a set for simplification
	for(let i = 0; i < 5; i++) {
		// First, check that the color at the index isn't already green
		if(colors[i] == "c") continue;

		// If not, continue checking for membership
		if(lettersCount[guessedWord[i]]) {
			console.log("in yellow colors code \n");
			colors[i] = "y";
			lettersCount[guessedWord[i]]--;
		}
	}

	console.log(colors);
	res.send(colors);	
}

// Set word route, simply grabs word of the day
app.get('/colors/:word', getColors);

app.get('/word', (req, res) => res.send(getWordOfDay()));

// Set validate route, takes in word, and validates it if it's in the dictionary.
app.get('/validate/:word', validateWord);


// Let app listen
app.listen(PORT, () => console.log("App listening on port " + PORT));

process.on('SIGINT', () => {
	process.exit(0);
})