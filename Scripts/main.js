import { getAllNotes } from "./getAllNotes.js";
import { displayAllNotes } from "./displayAllNotes.js";
import { countAllNotes } from "./countAllNotes.js";

export let pageSize = 10;
export let pageNumber = 1;
export let totalPages = 1;

const numbersContainer = document.querySelector(".numbers");
const sliderContainer = document.querySelector(".slide-numbers");


export const calculateTotalPages = async () => {
  const notesCount = await countAllNotes();
  totalPages = Math.ceil(notesCount / pageSize);
  return totalPages;
};


export async function loadPage( currentPageNum) {
  const notes = await getAllNotes(pageSize, currentPageNum);
  displayAllNotes(notes);
  highlightCurrentPage();
}


export function renderPaginationButtons(total) {
  let buttonsHTML = '';
  for (let i = 1; i <= total; i++) {
    buttonsHTML += `<button class="num" data-page="${i}">${i}</button>`;
  }
  numbersContainer.innerHTML = buttonsHTML;
}

export function highlightCurrentPage() {
  const allButtons = numbersContainer.querySelectorAll(".num");
  allButtons.forEach(btn => {
    btn.classList.remove("active");
    if (parseInt(btn.dataset.page) === parseInt(pageNumber)) {
      btn.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const total = await calculateTotalPages();
  await loadPage(pageNumber);
  renderPaginationButtons(total);
  highlightCurrentPage();
});


sliderContainer.addEventListener("click", async (e) => {
  const total = await calculateTotalPages();

  if (e.target.classList.contains("prev")) {
    pageNumber = pageNumber > 1 ? pageNumber - 1 : total;
  } else if (e.target.classList.contains("next")) {
    pageNumber = pageNumber < total ? pageNumber + 1 : 1;
  } else if (e.target.classList.contains("num")) {
    pageNumber = parseInt(e.target.dataset.page);
  } else {
    return;
  }

  await loadPage(pageNumber);
  renderPaginationButtons(total);
  highlightCurrentPage();
});
