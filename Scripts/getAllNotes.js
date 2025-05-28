import { BASE_URL } from './SharedData.js';

// Fetch all notes from the API
export const getAllNotes = async (pageSize = 0, pageNumber = 1) => {
  try {
    console.log(`${BASE_URL}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    const response = await fetch(`${BASE_URL}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const pagination = JSON.parse(response.headers.get("X-Pagination"));
    console.log(pagination)

    return data.result;
  } catch (error) {
    console.error("Error while fetching notes:", error);
    return [];
  }
};

