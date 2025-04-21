/** File to store all server-request related functions */

import axios from "axios";
// Server IP
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Simply grabs the word of the day
export async function getWordOfDay() {
	try {
		const response = await axios.get(SERVER_IP + "/word");
		return response.data;
	}catch(err) {
		console.error("Failed to fetch word of day", err);
	}
}

// Validates word passed in, true if valid, false if not
export async function validateWord(word) {
	try {
		const response = await axios.get(SERVER_IP + "/validate/" + word);
		return response.data;
	}catch(err) {
		console.error("Failed to validate word", err);
	}
}