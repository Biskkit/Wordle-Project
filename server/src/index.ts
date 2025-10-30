/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// ~1kB
import { env } from 'cloudflare:workers';
import { AutoRouter, cors } from 'itty-router'


// Default export to grab environment variables

const {preflight, corsify} = cors({
	origin: [env.CLIENT_URL],
	allowMethods: 'GET',
})

const router = AutoRouter({
	before: [preflight],
	finally: [corsify]
})

const oneDay = 1000 * 60 * 60 * 24;


// Initialize validGuesses and correct words
// Valid guesses list was taken from github.com/tabatkins/wordle-list
import guessesFile from '../assets/guesses'
const guesses = guessesFile.split('\n').map(line => line.trim());

// Answers list was taken from https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b#file-wordle-answers-alphabetical-txt-L8
import answersFile from '../assets/answers'
const answers = answersFile.split('\n').map(line => line.trim());

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
function validateWord(params: {word: string }) {
	// Grab word from params

	// See if word is in word set
	if(guessesSet.has(params.word.toLowerCase())) {
		return true
	}
	else {
		return false
	}
}

/* Gets colors of word in a string "wwwww", "cwyyc". Where 'w' is for wrong (gray), 'c' is for correct (green), and 'y' is for yellow */
function getColors(params: {word: string}) {
	// Grab word from request parameters
	let guessedWord = params.word.toLowerCase();
	// console.log("Got word " + guessedWord + "\n");
	// Make word lowercase
	guessedWord = guessedWord.toLowerCase();
	// Grab word of the day and lowercase
	let correctWord =  getWordOfDay().toLowerCase();
	// console.log("Correct word: " + correctWord + "\n");

	if(guessedWord == correctWord) {
		return "ccccc"
	}


	// Initialize array of colors
	let colors = Array(5).fill("w");

	// Frequency table for letters
	const lettersCount = new Map<string, number>();

	// Initialize freq table
	for(let i = 0; i < 5; i++) {
		let cur = lettersCount.get(correctWord[i]) || 0
		lettersCount.set(correctWord[i], cur + 1)
	}

	// First, iterate through, checking for words in the correct spot
	for(let i = 0; i < 5; i++) {
		if(guessedWord[i] == correctWord[i]) {
			colors[i] = "c";
			let cur = lettersCount.get(guessedWord[i]) || 0
			// Decrement count
			lettersCount.set(guessedWord[i], cur-1);
		}
	}
	
	// Then, iterate through, checking if each word exists in the correct word. Using a set for simplification
	for(let i = 0; i < 5; i++) {
		// First, check that the color at the index isn't already green
		if(colors[i] == "c") continue;

		// If not, continue checking for membership
		if((lettersCount.get(guessedWord[i]) || 0) > 0) {
			console.log(`Guessed letter: ${guessedWord[i]}. With frequency: ${lettersCount.get(guessedWord[i])}`)
			console.log("in yellow colors code \n");
			colors[i] = "y";
			lettersCount.set(guessedWord[i], (lettersCount.get(guessedWord[i]) || 1) - 1);
			console.log(`Updated frequency: ${lettersCount.get(guessedWord[i])}`)
		}
	}

	console.log(colors);
	return colors	
}

router.get('/colors/:word', getColors)
.get('/word', getWordOfDay)
.get('/validate/:word', validateWord);


export default {   
	...router
}