import './App.css'
import { InputArea } from './components/inputArea'
function App() {
  return (
    <>
      WORDLE
      <InputArea/>
    </>
  )
}

/**
 * Creates a color array for a corresponding word and correct word. It matches the two words, and then returns an array
 * with the color for each letter
 * @param {String} guessedWord
 * @param {String} correctWord 
 */
function getColors(guessedWord, correctWord) {
  // Upper case just to make things easier
  guessedWord = guessedWord.toUpperCase();
  correctWord = correctWord.toUpperCase();
  // Frequency table for letters
  const lettersCount = {};

  // Array to store colors, default to "gray"
  const colors = Array(5).fill("gray");

  // Initialize frequency table
  for(let i = 0; i < 5; i++) {
    lettersCount[correctWord[i]] = (lettersCount[correctWord[i]] || 0) + 1;
  }

  // First, iterate through, checking for words in the correct spot
  for(let i = 0; i < 5; i++) {
    if(guessedWord[i] == correctWord[i]) {
      colors[i] = "green";
      // Decrement count
      lettersCount[guessedWord[i]]--;
    }
  }

  // Then, iterate through, checking if each word exists in the correct word. Using a set for simplification
  for(let i = 0; i < 5; i++) {
    // First, check that the color at the index isn't already green
    if(colors[i] == "green") continue;

    // If not, continue checking for membership
    if(lettersCount[guessedWord[i]]) {
      colors[i] = "yellow";
      lettersCount[guessedWord[i]]--;
    }
  }
  // Everything else is gray by default, so no need to check for that
  // Return array of colors
  return colors;
}

export default App
