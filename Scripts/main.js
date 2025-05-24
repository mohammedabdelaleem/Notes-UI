import { BASE_URL } from './SharedData.js';

const notesContainer = document.querySelector(".notes");

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

const extractTitleDescription = (note) => ({
  id: note.id,
  title: note.title,
  description: note.description
});

const displayAllNotes = (notes) => {
  if (!Array.isArray(notes) || notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes available.</p>";
    return;
  }

  let allNotesHTML = '';
  for (const note of notes) {
    const { id, title, description } = extractTitleDescription(note);
    allNotesHTML += `
      <div class="note" data-id="${id}">
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>
        <div class="actions">
          <a href="./Pages/edit.html?id=${id}" class="btn edit"><i class="icon-pencil"></i></a>
          <button class="btn delete" data-id="${id}"><i class="icon-trash"></i></button>
        </div>
      </div>
    `;
  }
  notesContainer.innerHTML = allNotesHTML;
};

const DeleteeNote = async (noteId) => {
  try {
    const response = await fetch(`${BASE_URL}/${noteId}`, {
      method: "DELETE",  // uppercase recommended
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

document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes();
  displayAllNotes(notes);

  // Event delegation for dynamically created delete buttons
  notesContainer.addEventListener("click", async (eo) => {
    const deleteBtn = eo.target.closest(".delete");
    if (deleteBtn) {
      eo.preventDefault();

      const noteId = deleteBtn.dataset.id;
      if (!noteId) return;

      const confirmed = confirm("Are you sure you want to delete this note?");
      if (!confirmed) return;

      const success = await DeleteeNote(noteId);
      if (success) {
        // Refresh list after deletion
        const updatedNotes = await getAllNotes();
        displayAllNotes(updatedNotes);
      }
    }
  });
});
