import { getNote, BASE_URL } from "./SharedData.js";

/*
===================================
  Prepare and Validate DOM Elements
===================================
*/
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const btnSave = document.querySelector(".save");

if (!titleInput || !descriptionInput || !btnSave) {
  console.error("Missing DOM elements. Ensure IDs 'title', 'description' and a class 'save' exist.");
  alert("Form elements are missing from the page.");
  throw new Error("Critical error: Required form elements are missing.");
}

/*
===================================
 Load Edit Page and Set NOTE_ID
===================================
*/
let NOTE_ID = "";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  NOTE_ID = params.get("id");

  if (NOTE_ID) {
    try {
      const note = await getNote(NOTE_ID);
      if (note) {
        titleInput.value = note.title;
        descriptionInput.value = note.description;
      } else {
        alert("Note not found.");
      }
    } catch (error) {
      console.error("Error loading note:", error);
      alert("Failed to load note.");
    }
  } else {
    alert("No note ID provided in the URL.");
  }
});

/*
===================================
  Update Note (PUT Request)
===================================
*/
const UpdateNote = async (noteId, updatedNote) => {
  try {
    const response = await fetch(`${BASE_URL}/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedNote),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) {
      // No content returned, but update succeeded
      return null;
    }

    // Try parsing JSON only if content is expected
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      console.log("Note Updated:", data);
      return data;
    }

    return null;

  } catch (error) {
    console.error("Error updating note:", error);
    throw error; // re-throw to be caught in the caller
  }
};

/*
===================================
  Save Button Click Handler
===================================
*/
btnSave.addEventListener("click", async (eo) => {
  eo.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) {
    alert("Please fill in both title and description.");
    return;
  }

  const noteData = {
    id: NOTE_ID,
    title,
    description,
  };

  try {
    await UpdateNote(NOTE_ID, noteData);
    alert("Note updated successfully!");
    window.location.href = "../index.html"; 
  } catch (error) {
    alert("Failed to update the note.");
  }
});
