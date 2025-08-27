// Miscellaneous functions

// Imports
import { WRONG_COLOR, WRONG_PLACE_COLOR, CORRECT_COLOR} from './consts';

// Constants
const CORRECT_CHAR = "c";
const WRONG_PLACE_CHAR = "y";

/* Converts server string to array of colors */
export function string_to_colors(colors_string) {
	// Create array of wrong colors by default
	const colors = Array(5).fill(WRONG_COLOR);

	// Iterate through and fill with corresponding colors
	for(let i = 0; i < 5; i++) {
		switch(colors_string[i]) {
			case CORRECT_CHAR:
				colors[i] = CORRECT_COLOR;
				break;
			case WRONG_PLACE_CHAR:
				colors[i] = WRONG_PLACE_COLOR;
				break;
			default:
		}
	}

	// Return colors array
	return colors;
}