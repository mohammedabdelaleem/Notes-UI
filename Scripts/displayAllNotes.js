import { deleteNote } from "./deleteNote.js";
import { toggleArchive } from "./toggleArchive.js";
import { toggleFavorite } from "./toggleFavourite.js";
import { getAllNotes } from "./getAllNotes.js";
import {pageNumber, pageSize} from './main.js'

const notesContainer = document.querySelector(".notes");

// Extract required fields from a note
const extractNoteInfo = (note) => ({
  id: note.id,
  title: note.title,
  description: note.description,
  isArchieved: note.isArchieved,
  isFavourite: note.isFavourite,
  isVisible: note.isVisible
});

// Create HTML structure for a single note
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
      <button class="btn btn-archive" data-archive=0 data-id="${id}"><i class="icon-box-remove"></i></button>
      <button class="btn btn-heart" data-id="${id}">
        ${favHeart}
      </button>
      <button class="btn delete" data-id="${id}"><i class="icon-trash"></i></button>
    </div>
  </div>
`;


// Display all notes in the container
export const displayAllNotes = (notes) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes available.</p>";
    return;
  }

  let allNotesHTML = '';
  let counter = ((pageNumber-1)*pageSize)+1;
   //1 ==>  (1-1 *10)+1 =  +1
   //1 ==>  (2-1 *10)+1 =  11


  for (const note of notes) {
    const { id, title, description, isVisible, isFavourite, isArchieved } = extractNoteInfo(note);
    let favHeart = "";

    if (isVisible && !isArchieved) {
      favHeart = isFavourite
        ? `<i class="icon-heart-o empty-heart none"></i><i class="icon-heart full-heart favourite"></i>`
        : `<i class="icon-heart-o empty-heart"></i><i class="icon-heart full-heart none favourite"></i>`;

      allNotesHTML += createNoteHTML(id, title, description, counter++, favHeart);
    }
  }

  notesContainer.innerHTML = allNotesHTML;
};


// Handle all user actions (event delegation)
notesContainer.addEventListener("click", async (eo) => {
  const deleteBtn = eo.target.closest(".delete");
  const heartBtn = eo.target.closest(".btn-heart");
  const archiveBtn = eo.target.closest(".btn-archive");

  // Handle Delete
  if (deleteBtn) {
    eo.preventDefault();
    const noteId = deleteBtn.dataset.id;
    if (!noteId) return;

    const confirmed = confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    const success = await deleteNote(noteId);
    if (success) {
      const updatedNotes = await getAllNotes();
      displayAllNotes(updatedNotes);
    }
  }

  // Handle Favorite Toggle
  if (heartBtn) {
    eo.preventDefault();
    const noteId = heartBtn.dataset.id;
    const emptyHeart = heartBtn.querySelector(".empty-heart");
    const fullHeart = heartBtn.querySelector(".full-heart");

    const isNowFavourite = emptyHeart.classList.contains("none");

    // Toggle icons visually
    emptyHeart.classList.toggle("none");
    fullHeart.classList.toggle("none");

    await toggleFavorite(noteId, !isNowFavourite);
  }



  // Handle Archive Toggle
  if (archiveBtn) {
    eo.preventDefault();
    const noteId = archiveBtn.dataset.id;

    // after clicking 
   let isArchieved = false // now 
    const archive = archiveBtn.dataset.archive

    console.log(`${archive} before`)
    isArchieved = (archive ==0 )? true : false;
    console.log(`${isArchieved} after`)
  
    const success = await toggleArchive(noteId, isArchieved);
    if (success) {
      const updatedNotes = await getAllNotes();
      displayAllNotes(updatedNotes);
    }
  }
});
