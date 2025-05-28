import { BASE_URL } from './SharedData.js';



export // Toggle archive status
const toggleArchive = async (noteId, isArchived) => {
  const patchData = [
    {
      op: "replace",
      path: "/IsArchieved", // Ensure this matches C# property
      value: isArchived
    },
  {
    op: "replace",
    path: "/IsVisible",
    value: !isArchived
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
