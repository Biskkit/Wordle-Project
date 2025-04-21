import { useState } from "react";
export function InputArea() {
	// Index to store what guess the user is currently at
	let [index, setIndex] = useState(0);
	// Array of guesses. Each array will be tied to a specific word row via being passed in as a prop/parameter
	// This'll make it so that the word row is changed every time the word is updated
	let [array, setArray] = useState(['', '', '', '', '', '']);

	// React needs arrays to be duplicated as it won't update the state if you do direct manipulation like arr[1] = "something"
	/**
	 * @param {int} index, index of word to change
	 * @param {String} word, word to replace the old word with
	 */
	function changeWord(index, word) {
		// Duplicate array
		let newArr = [...array];
		newArr[index] = word;
		// Update state
		setArray[newArr];
	}

	// Now, each word row will take the word at the corresponding index as a prop/parameter
	return(
		<div className="inputArea">
			<WordRow word="TESTS" colors={["gray", "gray", "gray", "green"]}/>
			<WordRow word={array[1]} colors={[]}/>
			<WordRow word={array[2]} colors = {[]}/>
			<WordRow word={array[3]} colors={[]}/>
			<WordRow word={array[4]} colors={[]}/>
			<WordRow word={array[5]} colors={[]}/>
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
				// If letter is empty, return just an empty div
				if(letter == '') {
					return <div className="letter"></div>;
				}
				// If it isn't empty return the div with the corresponding background color
				return <div className="letter" style={{backgroundColor: colors[index]}}>{letter}</div>;
			})}
		</div>
	)
}