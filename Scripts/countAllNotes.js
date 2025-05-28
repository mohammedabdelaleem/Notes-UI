import { BASE_URL } from './SharedData.js';

// Fetch all notes from the API
export const countAllNotes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/count`);
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
