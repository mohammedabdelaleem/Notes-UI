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
    const { title, description } = extractTitleDescription(note);
    allNotesHTML += `
      <div class="note">
        <h2 class="title">${title}</h2>
        <p class="description">${description}</p>
      </div>
    `;
  }
  notesContainer.innerHTML = allNotesHTML;
};

document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes();
  displayAllNotes(notes);
});
