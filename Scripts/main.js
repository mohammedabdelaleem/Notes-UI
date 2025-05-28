import { getAllNotes } from "./getAllNotes.js";
import { displayAllNotes } from "./displayAllNotes.js";

// Pagination ==> pageSize ,  pageNumber
export let pageSize = 10;
export let pageNumber = 1;
let lastSliderPageNumber = 5
// Initialize notes on page load
document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes(pageSize, pageNumber);
  displayAllNotes(notes);
});

/*
==============================
  slider 
  --- i need to apply circular 
==============================
*/

const sliderNumbers = document.querySelector(".slide-numbers");
sliderNumbers.addEventListener("click", async(eo) => {

  if (eo.target.classList.contains("prev") ) {
pageNumber = pageNumber > 1 ? pageNumber - 1 : lastSliderPageNumber;
  } else if (eo.target.classList.contains("next") ) {

    pageNumber = (pageNumber % lastSliderPageNumber)+1; // i = (i+1)%size [0-based]
  
    // simple formula
    // pageNumber = pageNumber < lastSliderPageNumber ? pageNumber + 1 : 1;

  } else if (eo.target.classList.contains("num")) {
    pageNumber = parseInt(eo.target.innerText);
  }


//loadin
console.log(pageNumber)
    const notes = await getAllNotes(pageSize, pageNumber);
  displayAllNotes(notes);
});
