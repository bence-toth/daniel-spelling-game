const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let language = urlParams.get("lang") ?? "hu";

let voice;
new Promise((resolve) => {
  let synth = window.speechSynthesis;
  let id;

  id = setInterval(() => {
    if (synth.getVoices().length !== 0) {
      resolve(synth.getVoices());
      clearInterval(id);
    }
  }, 10);
}).then((voices) => {
  console.log(voices);
  voice = voices.find((voice) => voice.lang.startsWith(language)) ?? voices[0];
  console.log(voice);
});

const imageNode = document.getElementById("image");
const puzzleNode = document.getElementById("puzzle");
const lettersNode = document.getElementById("letters");

const letters = {
  hu: "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz".split(""),
  en: "abcdefghijklmnopqrstuvwxyz".split(""),
  da: "abcdefghijklmnopqrstuvwxyzæøå".split(""),
};

const renderLetterButtons = (lettersToRender) =>
  lettersToRender
    .map((letter) => `<button data-letter="${letter}">${letter}</button>`)
    .join("");

lettersNode.innerHTML = `
  <div>${renderLetterButtons(letters[language].slice(0, 12))}</div>
  <div>${renderLetterButtons(letters[language].slice(12, 24))}</div>
  <div>${renderLetterButtons(letters[language].slice(24))}</div>
`;

let isSpeaking = false;
const sayWord = (word) => {
  if (isSpeaking) {
    return;
  }
  isSpeaking = true;
  const message = new SpeechSynthesisUtterance();
  message.text = word;
  message.voice = voice;
  window.speechSynthesis.speak(message);
  let r = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(r);
    } else {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 1000);
  message.onend = () => {
    isSpeaking = false;
  };
};

const buttonClickHandler = (event) => {
  if ([...event.target.classList].includes("disabled")) {
    return;
  }
  event.target.classList.add("disabled");
  const selectedLetter = event.target.dataset.letter;
  const foundLetters = document.querySelectorAll(
    `#puzzleWord [data-letter='${selectedLetter}']`
  );
  if (foundLetters.length > 0) {
    foundLetters.forEach((foundLetter) => {
      foundLetter.innerHTML = selectedLetter;
    });
  }
  const isPuzzleSolved = [
    ...document.querySelectorAll("#puzzleWord [data-letter]"),
  ].every((letter) => letter.innerHTML !== "_");
  if (isPuzzleSolved) {
    lettersNode.querySelectorAll("button").forEach((button) => {
      button.classList.add("disabled");
    });
    setTimeout(() => {
      initPuzzle();
    }, 3000);
  }
};

lettersNode.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", buttonClickHandler);
  button.addEventListener("contextmenu", buttonClickHandler);
  button.addEventListener("auxclick", buttonClickHandler);
});

window.addEventListener("keyup", (event) => {
  [...lettersNode.querySelectorAll("button")]
    .find((button) => button.dataset.letter === event.key)
    ?.click();
});

imageNode.addEventListener("click", () => {
  sayWord(currentPuzzle[language]);
});

const getRandomElementFromArray = (array, exceptFor) => {
  const filteredArray = array.filter((item) => item[language] !== exceptFor);
  const randomIndex = Math.floor(Math.random() * filteredArray.length);
  return filteredArray[randomIndex];
};

let currentPuzzle = "";

const initPuzzle = () => {
  currentPuzzle = getRandomElementFromArray(puzzles, currentPuzzle);
  lettersNode.querySelectorAll("button").forEach((button) => {
    button.classList.remove("disabled");
  });
  imageNode.innerHTML = `
    <img class="puzzleImage" src="./assets/puzzles/${currentPuzzle.image}.jpg" />
  `;
  puzzleNode.innerHTML = `
    <div id="puzzleWord">
      ${currentPuzzle[language]
        .split("")
        .map((letter) => `<span data-letter="${letter}">_</span>`)
        .join("")}
    </div>
  `;
};

initPuzzle();
