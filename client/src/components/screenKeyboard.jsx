/* Component used for mobile users or anyone with a touch screen.
* Takes the keyboardColors array as a prop and uses it to display the correct colors accordingly
*/

export function OnScreenKeyBoard({ keyboardColors,  handleKeyPress }) {
	// 2D array to match world layout
	console.log("Rendering");
	const keyboard = 
	[['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
	['A', 'S', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
	['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']];
	
	return(
		<div className="keyboard">
			{/* Map each row to a "keyboardRow" class div */}
			{keyboard.map( (row) => {
				return(
				<div className="keyboardRow">
					{row.map( (key) => {
						let index = key.charCodeAt(0) - 'A'.charCodeAt(0);
						let color = keyboardColors[index];
						if(key != 'Enter' && key != 'Backspace') {
							return(
								<button style={ {backgroundColor: color } } className='keyboard' onClick={() => handleKeyPress(key)}>
									{key}
								</button>
							)
						}
						else {
							return(
								<button className='keyboard' onClick={() => handleKeyPress(key)}>
									{key}
								</button>
							)
						}
					})}
				</div>
				);
			})}
		</div>
	)
}