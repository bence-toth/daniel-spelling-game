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
      lettersNode.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
      setTimeout(() => {
        initPuzzle();
      }, 3000);
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
