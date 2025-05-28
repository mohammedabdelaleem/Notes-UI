import { BASE_URL } from './SharedData.js';


// Delete a note by ID
export const deleteNote = async (noteId) => {
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
