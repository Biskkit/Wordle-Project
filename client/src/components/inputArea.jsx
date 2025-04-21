import { useState } from "react";
/**
 * Takes in the current list of guesses along with the current list of colors corresponding to each letter
 * @returns Display of the words in a neatly organized grid
 */
export function InputArea({guesses, colors}) {
	// Now, each word row will take the word at the corresponding index as a prop/parameter
	return(
		<div className="inputArea">
			<WordRow word={guesses[0]} colors={colors[0]}/>
			<WordRow word={guesses[1]} colors={colors[1]}/>
			<WordRow word={guesses[2]} colors = {colors[2]}/>
			<WordRow word={guesses[3]} colors={colors[3]}/>
			<WordRow word={guesses[4]} colors={colors[4]}/>
			<WordRow word={guesses[5]} colors={colors[5]}/>
		</div>
	)

}
/**
 * @param word, string to show on the row.
 * @param colors, array of colors for each letter
 */
function WordRow({word, colors}) {
	// Pad string with trailing spaces so that it can be mapped to the div correctly
	// Turn into array as well so you can use map for each letter div
	word = word.padEnd(5).split("");

	return(
		<div className="word">
			{/* Map each letter, l to the corresponding div */}
			{word.map((letter, index) => {
				// If letter or colors array is empty, return just an empty div
				if(letter == '' || colors.length == 0) {
					return <div className="letter">{letter}</div>;
				}
				// If it isn't empty return the div with the corresponding background color
				return <div className="letter" style={{backgroundColor: colors[index]}}>{letter}</div>;
			})}
		</div>
	)
}