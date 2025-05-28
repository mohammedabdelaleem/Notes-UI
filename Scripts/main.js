import { getAllNotes } from "./getAllNotes.js";
import { displayAllNotes } from "./displayAllNotes.js";
import { countAllNotes } from "./countAllNotes.js";

export let pageSize = 10;
export let pageNumber = 1;
let lastSliderPageNumber = 1;

const numbersContainer = document.querySelector(".numbers");
const sliderContainer = document.querySelector(".slide-numbers");

document.addEventListener("DOMContentLoaded", async () => {
  const notesCount = await countAllNotes();
  lastSliderPageNumber = Math.ceil(notesCount / pageSize);
console.log(lastSliderPageNumber)
  await loadPage(pageNumber);
  renderPaginationButtons();
});

// Load notes for the current page
async function loadPage(pageNum) {
  const notes = await getAllNotes(pageSize, pageNum);
  displayAllNotes(notes);
  highlightCurrentPage();
}

// Render all pagination buttons
function renderPaginationButtons() {
  let buttonsHTML = '';
  for (let i = 2; i <= lastSliderPageNumber; i++) {
    buttonsHTML += `<button class="num" data-page="${i}">${i}</button>`;
  }
  numbersContainer.innerHTML += buttonsHTML;
}

// Highlight the current active page
function highlightCurrentPage() {
  const allButtons = numbersContainer.querySelectorAll(".num");
  allButtons.forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.page) === pageNumber) {
      btn.classList.add("active");
    }
  });
}

// Event listener for pagination buttons
sliderContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("prev")) {
    pageNumber = pageNumber > 1 ? pageNumber - 1 : lastSliderPageNumber;
  } else if (e.target.classList.contains("next")) {
    pageNumber = pageNumber < lastSliderPageNumber ? pageNumber + 1 : 1;
  } else if (e.target.classList.contains("num")) {
    pageNumber = parseInt(e.target.dataset.page);
  } else {
    return;
  }

  await loadPage(pageNumber);
});
