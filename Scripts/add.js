import { BASE_URL } from './SharedData.js';

/*
===================================
  Prepare and Validate DOM Elements
===================================
*/
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const btnCreate = document.querySelector(".create");

if (!titleInput || !descriptionInput || !btnCreate) {
  console.error("Missing DOM elements. Ensure IDs 'title', 'description' and a class 'create' exist.");
  alert("Form elements are missing from the page.");
  throw new Error("Critical error: Required form elements are missing.");
}

/*
===================================
  Post Data to Server
===================================
*/
const addNewObj = async (newObj) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newObj),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Server error: ${response.status} - ${errorText}`);
      return;
    }

    const data = await response.json();

    console.log(`Object created successfully!:${data._response}`);

    titleInput.value = "";
    descriptionInput.value = "";

    // Redirect after short delay for UX
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 300);

  } catch (error) {
    console.error("Error creating object:", error);
    alert("Failed to create object. Please try again.");
  }
};

/*
===================================
  Event Listener
===================================
*/
btnCreate.addEventListener("click", (eo) => {
  eo.preventDefault(); // Prevent form submission
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) {
    alert("Both title and description are required.");
    return;
  }

  addNewObj({ title, description });
});
