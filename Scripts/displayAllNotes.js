

import { deleteNote } from "./deleteNote.js";
import { toggleArchive } from "./toggleArchive.js";
import { toggleFavorite } from "./toggleFavourite.js";
import { pageNumber, pageSize, calculateTotalPages } from "./main.js";
import {
  loadPage,
  renderPaginationButtons,
  highlightCurrentPage,
} from "./main.js";
import { countCurrentNotes, countAllNotes } from "./countAllNotes.js";

const notesContainer = document.querySelector(".notes");

// Extract required fields from a note
const extractNoteInfo = (note) => ({
  id: note.id,
  title: note.title,
  description: note.description,
  isArchieved: note.isArchieved,
  isFavourite: note.isFavourite,
  isVisible: note.isVisible,
});


const createNoteHTML = (id, title, description, counter, favHeart) => `
  <div class="note" data-id="${id}">
    <div class="note-header">
      <p class="counter">${counter}</p>
      <div class="stars">
        <i class="icon-star star1"></i>
        <i class="icon-star star2"></i>
        <i class="icon-star star3"></i>
        <i class="icon-star star4"></i>
      </div>
    </div>
    <h3 class="title">${title}</h3>
    <p class="description">${description}</p>
    <div class="actions">
      <a href="./Pages/edit.html?id=${id}" class="btn edit"><i class="icon-pencil"></i></a>
      <button class="btn btn-archive" data-archive="0" data-id="${id}"><i class="icon-box-remove"></i></button>
      <button class="btn btn-heart" data-id="${id}">
        ${favHeart}
      </button>
      <button class="btn delete" data-id="${id}"><i class="icon-trash"></i></button>
    </div>
  </div>
`;


export const displayAllNotes = async (notes) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes available.</p>";
    return;
  }

  let allNotesHTML = "";
  let counter = (pageNumber - 1) * pageSize + 1;

  for (const note of notes) {
    const { id, title, description, isVisible, isFavourite } =
      extractNoteInfo(note);
    const favHeart = isFavourite
      ? `<i class="icon-heart-o empty-heart none"></i><i class="icon-heart full-heart favourite"></i>`
      : `<i class="icon-heart-o empty-heart"></i><i class="icon-heart full-heart none favourite"></i>`;

    allNotesHTML += createNoteHTML(id, title, description, counter++, favHeart);
  }

  notesContainer.innerHTML = allNotesHTML;
  highlightCurrentPage(); // Ensure active page button is highlighted
};


notesContainer.addEventListener("click", async (eo) => {
  const deleteBtn = eo.target.closest(".delete");
  const heartBtn = eo.target.closest(".btn-heart");
  const archiveBtn = eo.target.closest(".btn-archive");

  const AllNotesLength = await countAllNotes();
  const notesLengthAtTheLastPage = countCurrentNotes(AllNotesLength, pageSize);


  if (deleteBtn) {
    eo.preventDefault();
    const noteId = deleteBtn.dataset.id;
    let decrease = false;

    if (!noteId) return;

    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    const success = await deleteNote(noteId);

    if (success) {

      const totalPages = await calculateTotalPages();

      // Adjust current page if it exceeds new total pages
      if (pageNumber > totalPages) {
        //  pageNumber = totalPages;
        const currentPage = pageNumber - 1;
        await loadPage(currentPage);
        
        // console.log(`currentPage; ${currentPage}`)
        // console.log(`totalPages; ${totalPages}`)

        renderPaginationButtons(totalPages);
        highlightCurrentPage();
      } else {
        await loadPage(pageNumber);
        renderPaginationButtons(totalPages);
        highlightCurrentPage();
      }
    }
  }


  else if (heartBtn) {
    eo.preventDefault();
    const noteId = heartBtn.dataset.id;
    const emptyHeart = heartBtn.querySelector(".empty-heart");
    const fullHeart = heartBtn.querySelector(".full-heart");
    const isNowFavourite = emptyHeart.classList.contains("none");

    emptyHeart.classList.toggle("none");
    fullHeart.classList.toggle("none");

    await toggleFavorite(noteId, !isNowFavourite);
  }


  else if (archiveBtn) {
    eo.preventDefault();
    const noteId = archiveBtn.dataset.id;
    const archive = archiveBtn.dataset.archive;
    const isArchieved = archive === "0";

    const success = await toggleArchive(noteId, isArchieved);
    if (success) {
      await loadPage(pageNumber);
      renderPaginationButtons(totalPages);
      highlightCurrentPage(); 
    }
  }
});
