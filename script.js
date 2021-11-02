// Access Wordnik API for random word category select
const apiKey = config.api_key;

fetch("http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=5&maxLength=15&limit=3&api_key=" + apiKey)

    // Request the data in JSON format, then run a callback to enter it into the program
    .then(res => res.json())
    .then(data => {

        // Store data from API object directly into var for this program
        let randomAPIWord = [data[0].word, data[1].word, data[2].word];

        // Map a new array, that turns the above into uppercase for matching purposes
        randomAPIWord = randomAPIWord.map((w) => {
            return w.toUpperCase()
        });

        // Insert Wordnik API random word array into the program & gen random word in it
        randomBtn.onclick = () => {

            // If game has started already or is over, don't proceed
            if (gameInProgress || gameIsOver) return;

            // This category will be displayed to user inside DOM
            category = "Random";

            // The random word array is passed into the game and random word selected
            genRandomWordInCategory(randomAPIWord);
            alert("Random Words \nThere are " + userArr.length + " words in here to complete.");
        }
    })

    // Log any errors, such as when too many API requests are made
    .catch(err => console.log("There is an issue - check script & API key"))


// Set whatever category (array) user selects, select random word in it & assign to a var
function genRandomWordInCategory(currentArr) {
    let randomNumber = Math.floor(Math.random() * currentArr.length);
    window.randomWord = currentArr[randomNumber];
    userArr = currentArr;
}


// Sidebar functionality
sidebarOpenBtn.onclick = () => {
    categorySidebar.classList.add("sidebar-active");
}

sidebarCloseBtn.onclick = () => {
    categorySidebar.classList.remove("sidebar-active");
}


// Button functionality - inserts user's other chosen categories into the game
moviesBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Movies";
    genRandomWordInCategory(movies);
    alert("Movies \nThere are " + userArr.length + " words in here to complete.");
}

nounsBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Nouns";
    genRandomWordInCategory(nouns);
    alert("Nouns \nThere are " + userArr.length + " words in here to complete.");
}

foodBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Food";
    genRandomWordInCategory(food);
    alert("Food \nThere are " + userArr.length + " words in here to complete.");
}

animalsBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Animals";
    genRandomWordInCategory(animals);
    alert("Animals \nThere are " + userArr.length + " words in here to complete.");
}

countriesBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Countries";
    genRandomWordInCategory(countries);
    alert("Countries \nThere are " + userArr.length + " words in here to complete.");
}

videoGamesBtn.onclick = () => {
    if (gameInProgress || gameIsOver) return;

    category = "Video Games";
    genRandomWordInCategory(videoGames);
    alert("Video Games \nThere are " + userArr.length + " words in here to complete.");
}


// User can set own word for another to guess using this option
userChoiceBtn.onclick = () => {

    if (gameInProgress || gameIsOver) return;

    // Allow user to assign a category and enter a word for use in the DOM
    category = prompt("Please enter a CATEGORY or clue for your word.");
    let userWord = prompt("Please enter your WORD to be guessed. \n If your word is more than one word, please separate them with a hyphen, e.g. blue-whale.");

    // Insert the user's word into an empty array
    userSelectedWord.push(userWord);
    
    // If user hasn't typed anything, don't proceed
    if (userSelectedWord.length === 0) {
        alert("Please enter a word");
        return;
    }

    // Take the user's word and convert to uppercase for matching purposes
    userSelectedWord = userSelectedWord.map((f) => {
        return f.toUpperCase()
    });

    // Insert user's word into game. **NOTE** Originally designed for multiple words
    genRandomWordInCategory(userSelectedWord);
    alert("Your Own Words \nThere is " + userArr.length + " word to be guessed");
}


// Hard Mode is toggled on and off by user without restriction
hardModeBtn.onclick = () => {

    if (!hardModeIsEnabled) {
        hardModeIsEnabled = true;
        alert("Hard Mode Enabled!");
    } else {
        hardModeIsEnabled = false;
        alert("Hard Mode Disabled!");
    }
}


// Start the game
startGameBtn.onclick = () => {

    // If game has already begun, no more words will be generated
    if (gameInProgress || gameIsOver) return;

    // User must select a category beforehand, else game won't run:
    if (userArr === undefined) {
        alert("Please choose a category before starting the game.");
        return;
    }

    // Display selected category to user in DOM, run music and output first random word
    showCategory.textContent = category;
    BGM_LOOP();
    renderWord();
}


// Process the user's guess
submitGuessBtn.onclick = () => {

    // Code will not run until a word has been generated and something entered
    if (!wordGenerated || userGuess.value === "" || gameIsOver) return;

    // Stop user entering more than one letter 
    if (userGuess.value.length > 1) {
        alert("Nice try! ;) Please enter only one letter.");
        return;
    }

    // Clear any matching letters already processed to allow new processing each time
    matchingLetters = [];

    // Process user guesses
    manageUserGuesses();
    // Check for correct guesses
    processCorrectInput();
    // This must be set back as the manage user guesses function has ran above
    sameCorrectLetterUsed = false;
    // Check for incorrect guesses
    processErroneousInput();
    // Check for win or lose conditions
    gameManager();
}


// Main word management function to manage words, select & display them
function renderWord() {

    // Game has started at this point
    gameInProgress = true;

    // Keep track of random words already used & don't repeat them
    doNotRepeatRandomWord();

    console.log("1st: " + randomWord);

    console.log("Current word in use: " + randomWord);

    // A word has already been generated at this point
    wordGenerated = true;

    // The word is inserted into DOM, though invisible & ready for revealing
    outputWordToDOM();

    // All words chosen go into a dedicated array, so we can keep track of them
    previousWords.push(randomWord);
    console.log("Prev word arr after function run: " + previousWords);
}


// Play winning SFX, increment score by 1 & reset boolean as round is finished
function winRound() {
    applause.play();
    gameInProgress = false;
    hiScore++;
}


// Play losing SFX, run game over fn & reset boolean as round (& game) is over
function loseRound() {
    pauseMusic();
    evilLaugh.play();
    gameOverTheme.play();
    gameInProgress = false;
    gameOver();
}


// Game is over, disable all button functions
function gameOver() {
    gameIsOver = true;
    buttons.disabled = true;
    //sameCorrectLetterUsed = false;
}


// Manage the game's winning and losing criteria
function gameManager() {

    /* Grab number of correct letters that are revealed from assigned array - they are identified via checking they have the class 'letter-reveal', a class that's only allocated if they are a correct guess from the user */
    let lettersRevealed = document.querySelectorAll("#word-box .letter-reveal").length;

    // Win condition & lose condition - run corresponding events
    if (lettersRevealed === randomWord.length) {
        winRound();
        gameIsWon = true;
        endGameOverlay();
        hasCompletedCategory();
        // Bug fix: greater or equal to here, as guesses can increment by more than one!
    } else if (incorrectGuesses >= 10) {
        loseRound();
        gameIsWon = false;
        endGameOverlay();
    }

    // If game is not in progress, game must be over & resets will run
    !gameInProgress ? resetGameAndRoundSettings() : "";
}


// Grab the HTML element in DOM and use it to display user's hi-score
function showHiScore() {
    const OUTPUT_HIGH_SCORE = document.getElementById("hi-score");
    OUTPUT_HIGH_SCORE.textContent = `Your highest score is: ${hiScore}`;
}


// Resets required at the end of the game or round, making way for next game
function resetGameAndRoundSettings() {

    // Empty the previous guess and letter HTML array
    previousGuesses = [];
    letterElements = [];

    // Image resets with incorrect guesses , but NOT in hard mode
    hangmanImg.setAttribute("src", "media/images/0.jpg");

    // Reset incorrect guesses to 0 (if NOT in hard mode!)
    !hardModeIsEnabled ? incorrectGuesses = 0 : "";

    // Grab the HTML section where the word is generated...
    let wordBox = document.getElementById("word-box");
    // ...Then remove all of them using while
    while (wordBox.firstChild) {
        wordBox.removeChild(wordBox.lastChild);
    }

    // Re-run the fn to generate the next word and display current hi-score
    renderWord();
    showHiScore();
}


// This fn prevents same random word repeating inside the game flow
function doNotRepeatRandomWord() {

    // Generate a random word in the user's selected array
    genRandomWordInCategory(userArr);

    /* Essentially: As long as the previous word array has the current random word, and the length of that same array is less than the user's chosen category array, keep searching for another word that hasn't been used yet (that is, keep running the random word fn). The second 'AND' condition here prevents an infinite loop, not running the code once the previous word arr is fully cycled */
    while (previousWords.includes(randomWord) && previousWords.length < userArr.length) {
        console.log("Trackword fn in action: Already had: " + randomWord);
        genRandomWordInCategory(userArr);
        console.log("New word is now: " + randomWord);
        console.log(previousWords);
    }
}


// This fn actually visually generates the HTML letter elements for the DOM
function outputWordToDOM() {

    // Zero-indexed to give a sequential id to each letter generated - presently unused
    let idCount = 0;

    // Loop checks word length and makes corresponding amount of HTML for each letter
    for (let i = 0; i < randomWord.length; i++) {

        // Create a new span for each letter in whatever word has been pre-selected
        let newLetter = document.createElement("span");
        // Grab the area where this word will be inserted
        let wordBox = document.getElementById("word-box");

        // Set attr to be assigned to each letter - classes and an id (id unused)
        newLetter.setAttribute("class", "letter");
        newLetter.setAttribute("id", "letter-" + idCount++);
        // Add a border to the generated word using CSS
        wordBox.classList.add("word-border");
        // Add each letter to its selected area
        wordBox.appendChild(newLetter);

        // Split the random word into individual letters...
        let char = randomWord.charAt(i);
        // ...Then assign each letter to its own HTML space (span element)
        newLetter.innerHTML = char;
        // Hint displayed for user in DOM
        wordInfo.textContent = `Clue: Word is ${randomWord.length} characters`;
        // Each individual letter of the word is sent to an array for processing
        letterElements.push(newLetter);
        // Check if word is actually at least two separate words
        isMoreThanOneWord();
    }
}


// This function checks to see if there are any spaces and shows them to user as (-)
// Can be added to using || to check for periods or symbols etc
function isMoreThanOneWord() {

    // Run through the letters in each word and check for a hyphen. If so, show it
    letterElements.forEach(ele => {
        if (ele.textContent === "-") {
            ele.classList.add("letter-reveal");
            isTwoWords = true;
        }
    });

    // If the 'isTwoWords' bool switch is true, add a warning to the user saying so 
    isTwoWords ? wordInfo.append(" (and more than one word)") : "";
    isTwoWords = false;
}


// Determine the effect of user input: does letter match, is guess the same or incorrect?
function processCorrectInput() {

    // Loop through word. If any letters match the user's guess, send those to an array
    for (let i = 0; i < letterElements.length; i++) {

        if (letterElements[i].textContent === userGuess.value) {
            matchingLetters.push(letterElements[i]);
        }
    }

    // Stop 'correct' SFX playing if same correct letter has been used!
    if (sameCorrectLetterUsed === true) return;

    // Iterate through the html element array containing matches, and reveal them
    for (let i = 0; i < matchingLetters.length; i++) {
        matchingLetters[i].classList.add("letter-reveal");
        correct.play();
    }
}


// Fn to deal with any incorrect user guesses
function processErroneousInput() {

    // Correct guesses are sent to an array. If this array is empty, guess must be wrong
    if (matchingLetters.length === 0) {
        incorrectGuesses++;
        error.play();
    }

    // Change image to correspond with the amount of incorrect guesses
    incorrectGuesses ? hangmanImg.setAttribute("src", "media/images/" + incorrectGuesses + ".jpg") : "";
}


// Check prior guesses and display them in the DOM for user to see
function manageUserGuesses() {

    // Grab the HTML element that will display previously guessed letters
    let previousGuessElement = document.getElementById("previous-guesses");

    // Iterate through the previous guesses...
    for (let i = 0; i < previousGuesses.length; i++) {

        // If user has used a letter stored in this array, penalty!
        if (userGuess.value === previousGuesses[i]) {
            sameCorrectLetterUsed = true;
            error.play();
            alert("Same letter penalty: Already used " + previousGuesses[i]);
            incorrectGuesses++;
            // Loop severed here to stop penalty multiplying!
            break;
        }
    }

    // Continue recording all guesses by sending to the assigned array
    previousGuesses.push(userGuess.value);

    // Display each guess entered by user client in the DOM
    previousGuessElement.textContent = `My previous guesses: ${previousGuesses.join(", ")}`;
}


// This fn calls an overlay curtain down on round end or game over, displaying info
function endGameOverlay() {

    // Call the CSS class to invoke the overlay
    overlay.classList.add("overlay-slide-in");
    // Tell the user what the word was (regardless of success or failure)
    wordAnswer.textContent = `The word was: ${randomWord}`;

    // Display messages to the user depending on whether game was won or lost
    if (gameIsWon) {
        endRoundText.textContent = "YOU WON THE ROUND!";
        gameText.textContent = "The next word is now ready for guessing!";
    } else {
        endRoundText.textContent = "YOU LOST...GAME OVER!";
        gameText.textContent = "Better Luck Next Time! The browser will now reload so that you can play again.";
    }

    // Remove the class for adding the overlay and add the one to slide it out w. delay
    setTimeout(() => {
        overlay.classList.remove("overlay-slide-in");
        overlay.classList.add("overlay-slide-out");
        gameIsOver ? location.reload() : "";
    }, 8000);

    // Remove class after overlay has ran - otherwise overlay will run just once
    overlay.classList.remove("overlay-slide-out");
}


// Fn to measure whether user has finished all words in a selected category
function hasCompletedCategory() {

    /* If user score is equal to the length of their chosen word array, they must have completed all words in that category successfully, since no words can repeat */
    if (hiScore === userArr.length) {
        wordAnswer.textContent = `The word was: ${randomWord}`;
        gameText.textContent = "You've beaten this category. Nice job! The game will now reload so you can choose another category! And have you tried hard mode yet...?";

        // After message informing user of success, game will reload after 12s
        setTimeout(() => {
            location.reload();
        }, 12000);

    }
}


/* Fn to play the game's music. I used event listeners to create a loop of two tracks. When each song has ended, the other one plays. Thus, something always plays! */
const BGM_LOOP = () => {

    funBgm.play();

    funBgm.addEventListener("ended", () => {
        finishedBgm.play();
    });
    
    finishedBgm.addEventListener("ended", () => {
        funBgm.play();
    });
}


// Fn to pause the game's music, called at certain points in the program
function pauseMusic() {
    funBgm.pause();
    finishedBgm.pause();
}


/* Declaring a fn with a parameter saves repetiton of event code. This code assigns a mouseover and focus event to each button, and when each event is triggered on those buttons, a sound effect is played */
function playBtnUI(event) {

    buttons.forEach(btn => {
        btn.addEventListener(event, () => {
            toom.play();
        });
    });
}

// Attach the ui sounds to the buttons via both focus and mouseover events
playBtnUI("mouseover");
playBtnUI("focus");

// Change user input to uppercase, same as word array - ensures matches are found
userGuess.onkeyup = () => {
    userGuess.value = userGuess.value.toUpperCase();
}
