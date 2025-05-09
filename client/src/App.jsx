import './App.css'
import { useEffect, useState, useCallback } from 'react';
import { InputArea } from './components/inputArea'
import { MAX_LEN, GRAY, YELLOW, GREEN, MAX_GUESSES} from './consts';
import { OnScreenKeyBoard } from './components/screenKeyboard';
import { getWordOfDay, validateWord } from '../serverFunctions';

function App() {
  // Ref for focusing on main div
  // let mainDiv = useRef(null);
  // State to store if the correct guess has been made.
  // When this happens, no further input should be accepted.
  // Note: Input can also be halted when the curIndex reaches 5, i.e. when the max guesses have been reached
  let [done, setDone] = useState(false);
  let[error, setError] = useState('');

  // Current correct word to match guess with
  // (Just a placeholder for now). Should always be uppercase
  let [correctWord, setCorrectWord] = useState('');
  // Array of guesses
  let [guesses, setGuesses] = useState(['','','','','','']);
  // Array of colors for each guess
  let [guessColors, setGuessColors] = useState([[],[],[],[],[],[]]);
  // Current index into guesses array
  let [curIndex, setCurIndex] = useState(0);
  // Store mapping of each letter to the corresponding color
  // It'll be mapped via the character code ("Z" - "A" = 25)
  let [keyboardColors, setKeyboardColors] = useState(Array(26).fill(''));

  // reveal word
  let [revealWord, setRevealWord] = useState('');

/**
   * Adds extra word to the end of curString, should the length of curString be less than 5
   * @param {KeyboardEvent} e, keyevent 
   */
const handleKeyPress = useCallback( async (key) => {
  // Check for edge cases where either 1. The user guessed correctly already or 2. They reached max number of guesses at 6
  console.log(done);
  if(done || curIndex === MAX_GUESSES) {
    return;
  } 
  
  const curString = guesses[curIndex];
  const curKey = key.toUpperCase();
  if(curString.length < MAX_LEN && key.length == 1 && (curKey.charCodeAt(0)) >= "A".charCodeAt(0) && (curKey.charCodeAt(0)) <= 'Z'.charCodeAt(0)) {
    // Update guesses array to reflect this string
    const newGuesses = [...guesses];
    newGuesses[curIndex] = newGuesses[curIndex] + curKey;
    setGuesses(newGuesses);
  }
  // else, check if it's the enter key and handle accordingly. validating that the current guess is valid
  // and then initializing the color array at the current index
  else if(key == "Enter") {
    if(curString.length == MAX_LEN) {
      // Since the word is filled out, update the guessColors array at the current index.
      // And update the keyboard colors array as well
      // First check if it's valid
      try {
        const isValid = await validateWord(curString);
        if(isValid) {
          setError('');
           // Grab colors array
          const colors = getColors(curString, correctWord);
          // Copy guessColors, and then update state
          const updatedColors = [...guessColors];
          updatedColors[curIndex] = colors;
          setGuessColors(updatedColors);

          // update keyboard colors
          updateKeyboardColors(updatedColors);
          
          // Check if curString == correctWord. If so, set done to true
          console.log(curString);
          if(curString == correctWord.toUpperCase()) {
            setDone(true);
          }
          // increment index
          setCurIndex(curIndex+1);
          if(curIndex + 1 == MAX_GUESSES) setRevealWord("The word was " + correctWord);
        }
        else {
          setError('Word not in list!');
        }
      }
      catch(err) {
        console.error("Axios error", err);
      }
      
    }
  }
  // Finally, check if backspace was hit, in which case, the last letter inputted shall be deleted
  // Edge case: Word is empty 
  // No need to check MAX_LEN or anything since we're not adding anything
  else if(key == "Backspace") {
    // Return if string is already empty, don't need to do anything
    if(curString.length == 0) return;

    // Otherwise, delete the last letter of the string
    const newGuesses = [...guesses];
    newGuesses[curIndex] = curString.substring(0, curString.length - 1);
    // Update state
    setGuesses(newGuesses);
  }

   /**
 * Updates keyboard colors by grabbing the current word and the corresponding color array
 */
function updateKeyboardColors(colors) {
  // Grab current guess
  const guess = guesses[curIndex];
  // Grab corresponding colors
  const curRowColors = colors[curIndex];
  // Create new keyboard colors array
  const updatedKbColors = [...keyboardColors];
  // Iterate through, updating if needed
  for(let i = 0; i < 5; i++) {
    // grab corresponding color
    const color = curRowColors[i];
    // Grab index, mapping letter to its position in alphabet
    const index = guess.charCodeAt(i) - 'A'.charCodeAt(0);

    // Now, check if keyboard color is green, if so, there's no need to update, so just continue
    if(keyboardColors[index] == GREEN) continue;
    // Next check if color is yellow or green, if so update
    if(color == YELLOW || color == GREEN) updatedKbColors[index] = color;
    // Finally, check if the color is gray. Then it should only update when the keyboard hasn't stored a color there (i.e. the empty string)
    else  if(color == GRAY && updatedKbColors[index].length == 0) updatedKbColors[index] = color;
  }
  // update state
  setKeyboardColors(updatedKbColors);
}
}, [guesses, curIndex, guessColors, done, correctWord, keyboardColors]);


  // UseEffect to run once in the beginning to grab the word of the day
  useEffect(() => {
    async function fetchWordOfDay() {
      try {
        const word = await getWordOfDay();
        // set state
        setCorrectWord(word);
      }catch(err) {
        console.error("Axios error", err);
      }
    }
    fetchWordOfDay();
  }, [])  

// Context for passing down necessary functions to components
  // Focuses on div
  useEffect(() => {
    const listener = (e) => handleKeyPress(e.key);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener)
  }, [handleKeyPress])

  return (
    <div className='main'>
      WORDLE
      <InputArea guesses={guesses} colors={guessColors}/>
      <OnScreenKeyBoard keyboardColors={keyboardColors} handleKeyPress={handleKeyPress}/>
      <p>{error}</p>
      <p>{revealWord}</p>
    </div>
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
  const colors = Array(5).fill(GRAY);

  // Edge case where the guessed word is the correct word
  // In this case just return an array of all greens
  if(guessedWord == correctWord) {
    const colors = Array(5).fill(GREEN);
    return colors;
  }


  // Initialize frequency table
  for(let i = 0; i < 5; i++) {
    lettersCount[correctWord[i]] = (lettersCount[correctWord[i]] || 0) + 1;
  }

  // First, iterate through, checking for words in the correct spot
  for(let i = 0; i < 5; i++) {
    if(guessedWord[i] == correctWord[i]) {
      colors[i] = GREEN;
      // Decrement count
      lettersCount[guessedWord[i]]--;
    }
  }

  // Then, iterate through, checking if each word exists in the correct word. Using a set for simplification
  for(let i = 0; i < 5; i++) {
    // First, check that the color at the index isn't already green
    if(colors[i] == GREEN) continue;

    // If not, continue checking for membership
    if(lettersCount[guessedWord[i]]) {
      colors[i] = YELLOW;
      lettersCount[guessedWord[i]]--;
    }
  }
  // Everything else is gray by default, so no need to check for that
  // Return array of colors
  return colors;
}

export default App
