const voiceFiles = {
  positive: [
    "hurrah1",
    "hurrah2",
    "hurrah3",
    "hurrah4",
    "hurrah5",
    "hurrah6",
    "hurrah7",
    "super1",
    "super2",
    "super3",
    "super4",
    "super5",
    "super6",
    "yay1",
    "yay2",
    "yay3",
    "yay4",
  ],
  negative: ["oh-oh1", "oh-oh2", "oh-oh3", "oh-oh4"],
  applause: [
    "wow1",
    "wow2",
    "wow3",
    "wow4",
    "wow5",
    "woo-hoo1",
    "woo-hoo2",
    "woo-hoo3",
    "woo-hoo4",
  ],
};

const playSound = (type = "positive") => {
  const voiceFile = getRandomElementFromArray(voiceFiles[type]);
  const audio = new Audio(`./assets/sound/${voiceFile}.mp3`);
  audio.play();
};

const puzzleNode = document.getElementById("puzzle");
const lettersNode = document.getElementById("letters");

const letters = "aábcdeéfghiíjklmnoóöőpqrstuúüűvwxyz".split("");

const renderLetterButtons = (lettersToRender) =>
  lettersToRender
    .map((letter) => `<button data-letter="${letter}">${letter}</button>`)
    .join("");

lettersNode.innerHTML = `
  <div>${renderLetterButtons(letters.slice(0, 12))}</div>
  <div>${renderLetterButtons(letters.slice(12, 24))}</div>
  <div>${renderLetterButtons(letters.slice(24))}</div>
`;

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
    playSound("applause");
    setTimeout(() => {
      initPuzzle();
    }, 3000);
  } else if (foundLetters.length > 0) {
    playSound();
  } else {
    playSound("negative");
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

const getRandomElementFromArray = (array, exceptFor) => {
  const filteredArray = array.filter((item) => item !== exceptFor);
  const randomIndex = Math.floor(Math.random() * filteredArray.length);
  return filteredArray[randomIndex];
};

let currentPuzzle = "";

const initPuzzle = () => {
  currentPuzzle = getRandomElementFromArray(puzzles, currentPuzzle);
  lettersNode.querySelectorAll("button").forEach((button) => {
    button.classList.remove("disabled");
  });
  puzzleNode.innerHTML = `
    <img class="puzzleImage" src="${currentPuzzle.image}" />
    <div id="puzzleWord">
      ${currentPuzzle.word
        .split("")
        .map((letter) => `<span data-letter="${letter}">_</span>`)
        .join("")}
    </div>
  `;
};

initPuzzle();
