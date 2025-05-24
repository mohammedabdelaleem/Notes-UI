import { BASE_URL } from './SharedData.js';

/*
===================================
  Prepare DOM elements
===================================*/

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const btnCreate = document.getElementsByClassName("create")[0];

/*
==============================================
 Ensure DOM elements exist before continuing
 click event ==> send data
===============================================*/

if (!titleInput || !descriptionInput || !btnCreate) {
  console.error("One or more form elements are missing. Ensure the HTML contains elements with IDs 'title', 'description' and a class 'create'.");
      alert("One or more form elements are missing. Ensure the HTML contains elements with IDs 'title', 'description' and a class 'create'.");

} else {

  btnCreate.addEventListener("click", () => {
    const newObj = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
    };


    if (!newObj.title || !newObj.description) {
      alert("Both title and description are required.");
      return;
    }

    addNewObj(newObj);
  });
}

/*
==============================================
 Send Post Request
===============================================*/

const addNewObj = async (newObj) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newObj),
    });

    // Check if the response is OK (status in the range 200–299)
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Object Created Successfully:", data);

    titleInput.value = "";
    descriptionInput.value = "";

    window.location.href = "index.html";

  } catch (error) {
    // Restore input values for user convenience
    titleInput.value = newObj.title;
    descriptionInput.value = newObj.description;

    console.error("Error creating object:", error);
    alert("Failed to create object. Please try again.");
  }
};
