// Globals

// All available word object arrays (sourced in words.js)
const insults = WORD_OBJ.insults;
const animals = WORD_OBJ.animals;
const food = WORD_OBJ.food;
const countries = WORD_OBJ.countries;
const nouns = WORD_OBJ.nouns;
const movies = WORD_OBJ.movies;
const videoGames = WORD_OBJ.video_games;
let userSelectedWord = WORD_OBJ.userSelected;

// All button elements stored here
const userChoiceBtn = document.getElementById("user-choice");
const startGameBtn = document.getElementById("start");
const hardModeBtn = document.getElementById("hard-mode");
const insultsBtn = document.getElementById("insults");
const moviesBtn = document.getElementById("movies");
const nounsBtn = document.getElementById("nouns");
const foodBtn = document.getElementById("food");
const animalsBtn = document.getElementById("animals");
const countriesBtn = document.getElementById("countries");
const videoGamesBtn = document.getElementById("video-games");
const randomBtn = document.getElementById("random-word");
const submitGuessBtn = document.getElementById("submit-guess");
const buttons = document.querySelectorAll("button");
const sidebarOpenBtn = document.getElementById("open-btn");
const sidebarCloseBtn = document.getElementById("close-btn");

// Access to HTML elements in the DOM
const body = document.body;
const showCategory = document.getElementById("show-category");
const wordInfo = document.getElementById("word-info");
const userGuess = document.getElementById("guess");
const hangmanImg = document.getElementById("hangman-img");
const categorySidebar = document.getElementById("cat-sidebar");
const wordAnswer = document.getElementById("word-answer");
const gameText = document.getElementById("game-text");
const overlay = document.getElementById("myNav");
const endRoundText = document.getElementById("end-round-text");

// Stores whatever predefined category user chooses, then it's shown in the DOM
let category;

// Holds whatever word the user selects as the value
let userArr;

// Arrays used in the program
let matchingLetters = [];
let previousGuesses = [];
let previousWords = [];
let letterElements = [];

// Number of wrong answers and score, initialised at 0
let incorrectGuesses = 0;
let hiScore = 0;

// Booleans used to track game status changes
let wordGenerated = false;
let gameInProgress = false;
let gameIsOver = false;
let hardModeIsEnabled = false;
let sameCorrectLetterUsed = false;
let gameIsWon = false;
let isTwoWords = false;

// Audio object initialisation
let gameOverTheme = new Audio("media/sound/gameover.mp3");;
let applause = new Audio("media/sound/applause.wav");
let toom = new Audio("media/sound/toom.wav");
let cackle = new Audio("media/sound/cackle.wav");
let error = new Audio("media/sound/error.mp3");
let evilLaugh = new Audio("media/sound/evil_laugh.wav");
let correct = new Audio("media/sound/win.wav");

// BGM in-game
let funBgm = new Audio("media/sound/funbgm.wav");
let finishedBgm = new Audio("media/sound/finished.wav");

// ES6 destructuring to shorten code lines and set multiple sound volumes
[toom.volume, correct.volume, error.volume, applause.volume, gameOverTheme.volume, finishedBgm.volume] = [0.3, 0.4, 0.3, 0.6, 0.4, 0.8];