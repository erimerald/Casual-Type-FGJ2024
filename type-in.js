//-- > VARIABLES < --//
// define the time limit
let TIME_LIMIT = 60;

// define quotes to be used
let quotes_array = [
  "It always begins with a challenge.",
  "And they who light upon this book should bear in mind not only that I write for the clearing of our parish from ill fame and calumny, but also a thing which will, I trow, appear too often in it, to wit—that I am nothing more than a plain unlettered man, not read in foreign languages, as a gentleman might be, nor gifted with long words (even in mine own tongue), save what I may have won from the Bible or Master William Shakespeare, whom, in the face of common opinion, I do value highly. In short, I am an ignoramus, but pretty well for a yeoman.",
  "I was worried I might have a gambling problem, but then I realized that I'm just playing the cards that I was dealt.",
  "Ghosts are bad liars because you can see right through them.",
  "The coach went to the bank to get his quarterback.",
  "I'm reading a book about anti-gravity, it's impossible to put down.",
  "Dogs can't operate MRI machines but catscan.",
  "I used to play piano by ear, but now I use my hands.",
  "I just don't trust stairs, they're always up to something.",
  "I told my doctor I heard buzzing, but she said it's just a bug that's going around.",
  "A ship carrying red paint and a ship carrying blue paint collide in the middle of the ocean. Both crews were marooned.",
  "I asked my dog what's two minus two. He said nothing.",
];

// selecting required elements
let timer_text = document.querySelector(".curr_time");
let accuracy_text = document.querySelector(".curr_accuracy");
let error_text = document.querySelector(".curr_errors");
let cpm_text = document.querySelector(".curr_cpm");
let wpm_text = document.querySelector(".curr_wpm");
let quote_text = document.querySelector(".quote");
let input_area = document.querySelector(".input_area");
let restart_btn = document.querySelector(".restart_btn");
let cpm_group = document.querySelector(".cpm");
let wpm_group = document.querySelector(".wpm");
let error_group = document.querySelector(".errors");
let end_game_screen = document.querySelector(".game-over");
let accuracy_group = document.querySelector(".accuracy");
let soundtrack = [
  new Audio("audio/happy.wav"),
  new Audio("audio/darkness.wav"),
];

let audioPaused = true;
let audioHappy = new Audio("audio/happy.wav");
let audioDarkness = new Audio("audio/darkness.wav");

let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;

//-- > GET TEXT, SEPARATE INTO LETTERS < --//

function updateQuote() {
  quote_text.textContent = null;
  current_quote = quotes_array[quoteNo];

  // separate each character and make an element
  // out of each of them to individually style them
  current_quote.split("").forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    quote_text.appendChild(charSpan);
  });

  // roll over to the first quote
  if (quoteNo < quotes_array.length - 1) quoteNo++;
  else quoteNo = 0;
}

//-- > GET INPUT TEXT, CHECK FOR ERRORS < --//
function processCurrentText() {
  // get current input text and split it
  curr_input = input_area.value;
  curr_input_array = curr_input.split("");

  // increment total characters typed
  characterTyped++;

  errors = 0;

  quoteSpanArray = quote_text.querySelectorAll("span");
  quoteSpanArray.forEach((char, index) => {
    let typedChar = curr_input_array[index];

    // character not currently typed
    if (typedChar == null) {
      char.classList.remove("correct_char");
      char.classList.remove("incorrect_char");

      // correct character
    } else if (typedChar === char.innerText) {
      char.classList.add("correct_char");
      char.classList.remove("incorrect_char");

      // incorrect character
    } else {
      char.classList.add("incorrect_char");
      char.classList.remove("correct_char");

      // increment number of errors
      errors++;
    }
  });

  // display the number of errors
  error_text.textContent = total_errors + errors;

  // update accuracy text
  let correctCharacters = characterTyped - (total_errors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
  accuracy_text.textContent = Math.round(accuracyVal);
  darkness();

  // if current text is completely typed
  // irrespective of errors
  if (curr_input.length == current_quote.length) {
    updateQuote();

    // update total errors
    total_errors += errors;

    // clear the input area
    input_area.value = "";
  }
}

//-- > START NEW GAME, RESET VALUES & TIMERS < --//
function startGame() {
  resetValues();
  updateQuote();
  // audioHappy.play();

  // clear old and start a new timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  input_area.disabled = false;
  end_game_screen.classList.add("hidden");

  input_area.value = "";
  quote_text.textContent = "Click on the area below to start the game.";
  accuracy_text.textContent = 0;
  timer_text.textContent = timeLeft + "s";
  error_text.textContent = 0;
  restart_btn.style.display = "none";
  cpm_group.style.display = "none";
  wpm_group.style.display = "none";
}

//-- > TRACK TIME < --//

function updateTimer() {
  if (timeLeft > 0) {
    // decrease the current time left
    timeLeft--;

    // increase the time elapsed
    timeElapsed++;

    // update the timer text
    timer_text.textContent = timeLeft + "s";
  } else {
    // finish the game
    finishGame();
  }
}

//-- > PLAY MUSIC < --//

//-- > DARKNESS  < --//

function darkness() {
  if (errors > 16 && audioHappy.play(true)) {
    audioHappy.pause();
    audioDarkness.play();
    console.log(errors);
  } else if (errors <= 15 && audioDarkness.play(true)) audioDarkness.pause();
  audioHappy.play();
  console.log(errors);
  // audioDarkness.play();
}

// let size = errors;

// function draw() {
//   document.documentElement.style.setProperty("--size", size);
//   requestAnimationFrame(draw);
// }

// requestAnimationFrame(draw);

//-- > END GAME, PROMPT RESTART & WPM CALCULATION SCORE  < --//

function finishGame() {
  // stop the timer
  clearInterval(timer);
  audioHappy.currentTime = 0;
  audioDarkness.currentTime = 0;
  audioHappy.pause();
  audioDarkness.pause();

  // disable the input area
  input_area.disabled = true;
  end_game_screen.classList.remove("hidden");

  // show finishing text
  quote_text.textContent = "Click on Restart to start a new game.";

  // display restart button
  restart_btn.style.display = "block";

  // calculate cpm and wpm
  cpm = Math.round((characterTyped / timeElapsed) * 60);
  wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);

  // update cpm and wpm text
  cpm_text.textContent = cpm;
  wpm_text.textContent = wpm;

  // display the cpm and wpm
  cpm_group.style.display = "block";
  wpm_group.style.display = "block";
}
