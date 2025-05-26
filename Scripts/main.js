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
      <button class="btn btn-archive" data-id="${id}"><i class="icon-box-remove"></i></button>
      <button class="btn btn-heart" data-id="${id}">
        ${favHeart}
      </button>
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
      alert("Failed to delete the note.");
      return false;
    }
  } catch (error) {
    alert("An error occurred while deleting the note.");
    return false;
  }
};

// Toggle favorite status
const toggleFavorite = async (noteId, isFavorite) => {
  const patchData = [
    {
      op: "replace",
      path: "/IsFavourite",
      value: isFavorite
    }
  ];

  try {
    const response = await fetch(`${BASE_URL}/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json"
      },
      body: JSON.stringify(patchData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Patch failed");
    }

    const result = await response.json();
    console.log("Favorite updated:", result);
    return true;
  } catch (error) {
    console.error("Error toggling favorite:", error.message);
    return false;
  }
};

// Toggle archive status
const toggleArchive = async (noteId, isArchived) => {
  const patchData = [
    {
      op: "replace",
      path: "/IsArchieved", // Ensure this matches C# property
      value: isArchived
    }
  ];

  try {
    const response = await fetch(`${BASE_URL}/${noteId}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json-patch+json"
      },
      body: JSON.stringify(patchData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Patch failed");
    }

    const result = await response.json();
    console.log("Archive updated:", result);
    return true;
  } catch (error) {
    console.error("Error toggling archive:", error.message);
    return false;
  }
};

// Initialize notes on page load
document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes();
  displayAllNotes(notes);
});

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

    const success = await toggleArchive(noteId, true);
    if (success) {
      const updatedNotes = await getAllNotes();
      displayAllNotes(updatedNotes);
    }
  }
});
