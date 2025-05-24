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
  id:note.id,
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
    const { id,title, description } = extractTitleDescription(note);
    allNotesHTML += `
      <div class="note" data-id="${id}">
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>

          <div class="actions">
          <a href="./Pages/edit.html?id=${id}" class="btn edit" ><i class="icon-pencil"></i></a>
          <button class="btn delete" data-id="${id}"><i class="icon-trash"></i></button>
        </div>
      </div>
    `;
  }
  notesContainer.innerHTML = allNotesHTML;
};





document.addEventListener("DOMContentLoaded", async () => {
  const notes = await getAllNotes();
  displayAllNotes(notes);

  // Use event delegation for dynamically added edit buttons
});

/*
=============================
  Edit 
=============================
*/ 

