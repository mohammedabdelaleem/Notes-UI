import { BASE_URL } from './SharedData.js';

const notesContainer = document.querySelector(".notes");

// Fetch all notes from the API
const getAllNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error while fetching notes:", error);
    return [];
  }
};

// Extract required fields from a note
const extractTitleDescription = (note) => ({
  id: note.id,
  title: note.title,
  description: note.description
});

// Create HTML structure for a single note
const createNoteHTML = (id, title, description, counter) => `
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
      <button class="btn" data-id="${id}"><i class="icon-box-remove"></i></button>
          <button class="btn" data-id="${id}"><i class="icon-heart-o"></i></button>
      <button class="btn delete" data-id="${id}"><i class="icon-trash"></i></button>
    </div>
  </div>
`;

// Display all notes in the container
const displayAllNotes = (notes) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes available.</p>";
    return;
  }

  let allNotesHTML = '';
  let counter = 1;

  for (const note of notes) {
    const { id, title, description } = extractTitleDescription(note);
    allNotesHTML += createNoteHTML(id, title, description, counter++);
  }

  notesContainer.innerHTML = allNotesHTML;
};

// Delete a note by ID
const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/${noteId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Note with ID ${noteId} deleted successfully`);
      return true;
    } else {
      console.error("Failed to delete note");
      alert("Failed to delete the note.");
      return false;
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    alert("An error occurred while deleting the note.");
    return false;
  }
};

// Initialize notes on page load
document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes();
  displayAllNotes(notes);

  // Event delegation for delete buttons
  notesContainer.addEventListener("click", async (eo) => {
    const deleteBtn = eo.target.closest(".delete");
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
  });
});
