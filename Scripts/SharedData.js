export let BASE_URL = "https://localhost:7002/api/Note";

export async function getNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result != null) {
      return data.result; // Return the actual note data
    } else {
      return null; 
    }

  } catch (error) {
    console.error("Error while fetching note:", error);
    return null; 
  }
}
