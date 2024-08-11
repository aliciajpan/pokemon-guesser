// curated list, based on popularity + if front/back images are available
const pokeNames = [
  "pikachu",
  "squirtle",
  "bulbasaur",
  "snorlax",
  "charmander",
  "eevee",
  "piplup",
  "magikarp",
  "mudkip",
  "rowlet",
];

const POKEURL = "https://pokeapi.co/api/v2/pokemon/";
const pokeImg = document.getElementById("img");
let pokemonListCopy = [];
let score = 0;
let currentPokemon = {};
let currentPokemonInt = 0;
const pokemonList = [];

fetchPokemon();
addEventListeners();

async function fetchPokemon() {
  try {
    for (let i = 0; i < pokeNames.length; i++) {
      const url = `${POKEURL}/${pokeNames[i]}`;
      const pokemon = await axios.get(url);

      pokemonList.push({
        name: pokemon.data.name,
        front: pokemon.data.sprites.front_default,
        back: pokemon.data.sprites.back_default,
        sound: pokemon.data.cries.latest,
      });
    }

    currentPokemon = pokemonList[0];
    fillPicture();
    setOptions();
  } catch (error) {
    console.error(error);
  }
}

function handleClick(event) {
  checkAnswer(event);

  setNextPokemon();
}

function checkAnswer(event) {
  if (event.target.innerText !== currentPokemon.name) {
    console.log("wrong");
    setScore(--score);
  } else {
    console.log("correct");
    setScore(++score);;
  }

  let snd = new Audio(currentPokemon.sound);
  snd.volume = 0.1;
  snd.play();
  revealPicture();

  // const label = document.getElementById("pokemon-name");
  // label.innerText = currentPokemon.name;
}

function setNextPokemon() {
  const sleepHandler = (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

  const sleep = async () => {
    await sleepHandler(1200);
    setNextPokemonInt();
    currentPokemon = pokemonList[currentPokemonInt];
    fillPicture();
    setOptions();
  };

  sleep();
}

// HELPER FUNCTIONS
function addEventListeners() {
  let choiceA = document.getElementById("a");
  let choiceB = document.getElementById("b");
  let choiceC = document.getElementById("c");
  let choiceD = document.getElementById("d");

  choiceA.addEventListener("click", handleClick);
  choiceB.addEventListener("click", handleClick);
  choiceC.addEventListener("click", handleClick);
  choiceD.addEventListener("click", handleClick);
}

function removeName(arr, name) {
  return arr.filter((poke) => {
    return poke !== name;
  });
}

function setOptions() {
  const choiceA = document.getElementById("a");
  const choiceB = document.getElementById("b");
  const choiceC = document.getElementById("c");
  const choiceD = document.getElementById("d");

  const choicesArray = [choiceA, choiceB, choiceC, choiceD];

  let wrongNames = removeName(pokeNames, currentPokemon.name);

  for (let i = 0; i < choicesArray.length; i++) {
    let x = Math.floor(Math.random() * (9 - i));
    choicesArray[i].innerText = wrongNames[x];
    wrongNames = removeName(wrongNames, wrongNames[x]);
  }

  let correct = Math.floor(Math.random() * 4);
  choicesArray[correct].innerText = currentPokemon.name;
}

function setNextPokemonInt() {
  if (currentPokemonInt >= 9) {
    currentPokemonInt = 0;
    setScore(0);
  } else {
    currentPokemonInt += 1;
  }
}

function fillPicture() {
  pokeImg.src = currentPokemon.back;
}

function revealPicture() {
  pokeImg.src = currentPokemon.front;
}

function setScore(n) {
  score = n;
  const scoreCard = document.getElementById("game-score");
  scoreCard.innerText = score;
}