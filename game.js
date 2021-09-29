const puzzles = [
  {
    word: "alma",
    image: "https://media.istockphoto.com/photos/red-apple-picture-id495878092",
  },
  {
    word: "körte",
    image:
      "https://media.istockphoto.com/photos/pear-green-with-leaf-picture-id186861864",
  },
];

const letters = [
  "a",
  "á",
  "b",
  "c",
  "d",
  "e",
  "é",
  "f",
  "g",
  "h",
  "i",
  "í",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "ó",
  "ö",
  "ő",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "ú",
  "ü",
  "ű",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const puzzleNode = document.getElementById("puzzle");
const lettersNode = document.getElementById("letters");

lettersNode.innerHTML = letters
  .map((letter) => `<button data-letter="${letter}">${letter}</button>`)
  .join("");

lettersNode.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.target.disabled = true;
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
      console.log("yay");
      initPuzzle();
    }
  });
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
    button.disabled = false;
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
