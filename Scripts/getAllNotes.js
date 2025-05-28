import { BASE_URL } from './SharedData.js';

// Fetch all notes from the API
export const getAllNotes = async (pageSize = 0, pageNumber = 1,taget="") => {
  try {
    let url = `${BASE_URL}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`

    if(taget == "archived")
url =`${BASE_URL}/all-archived?pageSize=${pageSize}&pageNumber=${pageNumber}`

    else if(taget == "favourite")
url =`${BASE_URL}/all-favourite?pageSize=${pageSize}&pageNumber=${pageNumber}`

    console.log(url)
    const response = await fetch(url);
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

