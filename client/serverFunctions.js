/** File to store all server-request related functions */

import axios from "axios";
// Server IP
const SERVER_IP = import.meta.env.VITE_APP_SERVER_URL;

// Grabs colors of the word represented by a string
export async function getColorsString(word) {
	try {
		const response = await axios.get(SERVER_IP + "colors/" + word);
		return response.data;
	}catch(err) {
		console.error("Failed to fetch word of day", err);
	}
}

// Validates word passed in, true if valid, false if not
export async function validateWord(word) {
	try {
		const response = await axios.get(SERVER_IP + "validate/" + word);
		return response.data;
	}catch(err) {
		console.error("Failed to validate word", err);
	}
}

export async function getWordOfDay() {
	try {
		const word = await axios.get(SERVER_IP + "word");
		return word.data;
	}catch(err) {
		console.error("Failed to fetch word of day\n", err);
	}
}