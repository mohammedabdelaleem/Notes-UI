
import { BASE_URL } from './SharedData.js';


// Toggle favorite status
export const toggleFavorite = async (noteId, isFavorite) => {
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
