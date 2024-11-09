// Define DOM elements only if on notes page
let noteForm, noteTitle, noteText, saveNoteBtn, newNoteBtn, clearBtn, noteList;
if (window.location.pathname === "/notes") {
  noteForm = document.querySelector(".note-form");
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteBtn = document.querySelector(".save-note");
  newNoteBtn = document.querySelector(".new-note");
  clearBtn = document.querySelector(".clear-btn");
  noteList = document.querySelector(".list-container .list-group");
}

let activeNote = {};

// Helper functions to toggle element visibility
const show = (el) => el.classList.remove("d-none");
const hide = (el) => el.classList.add("d-none");

// Fetch all notes
const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

// Save a new note or update an existing one
const saveNote = (note) =>
  fetch("/api/notes", {
    method: note.id ? "PUT" : "POST", // If the note has an ID, it's an update (PUT)
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

// Delete a note by ID
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

// Render the active note into the form
const renderActiveNote = () => {
  hide(saveNoteBtn); // Hide save button by default
  hide(clearBtn); // Hide clear button by default

  if (activeNote.id) {
    show(saveNoteBtn); // Show save button when editing
    show(clearBtn); // Show clear button when editing
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = activeNote.title || "";
    noteText.value = activeNote.text || "";
    saveNoteBtn.innerText = "Save Changes"; // Change button text for editing
  } else {
    hide(saveNoteBtn); // Hide save button for new note
    show(newNoteBtn); // Show new note button for creating a new note
    noteTitle.value = "";
    noteText.value = "";
    hide(clearBtn); // Hide clear button if no note is selected
  }
};

// Save the note (either create or update) and re-render the list
const handleNoteSave = () => {
  const newNote = { title: noteTitle.value, text: noteText.value };
  if (activeNote.id) {
    // If the note is being edited, include the note ID for PUT
    newNote.id = activeNote.id;
  }
  saveNote(newNote).then(() => {
    getAndRenderNotes(); // Re-render the notes list
    activeNote = {}; // Reset active note after saving
    renderActiveNote(); // Reset the active note form
  });
};

// Handle note deletion
const handleNoteDelete = (e) => {
  e.stopPropagation();
  const noteId = JSON.parse(
    e.target.closest(".list-group-item").getAttribute("data-note")
  ).id;
  if (activeNote.id === noteId) activeNote = {};
  deleteNote(noteId).then(() => {
    getAndRenderNotes(); // Re-render the notes list
    renderActiveNote(); // Reset the active note form
  });
};

// View a specific note and allow editing
const handleNoteView = (e) => {
  e.preventDefault();
  const note = JSON.parse(
    e.target.closest(".list-group-item").getAttribute("data-note")
  );
  activeNote = note;
  renderActiveNote(); // Render the active note form
};

// Prepare form for a new note
const handleNewNoteView = () => {
  activeNote = {}; // Reset active note for new note
  noteTitle.value = "";
  noteText.value = "";
  noteTitle.removeAttribute("readonly");
  noteText.removeAttribute("readonly");
  show(clearBtn); // Show clear button when creating a new note
  hide(saveNoteBtn); // Hide save button when creating a new note
  saveNoteBtn.innerText = "Save Note"; // Reset button text for new note
  show(newNoteBtn); // Show new note button
  handleRenderBtns(); // Make sure buttons are shown properly based on inputs
};

// Clear the form
const handleClearForm = () => {
  noteTitle.value = "";
  noteText.value = "";
  hide(clearBtn); // Hide the clear button after clearing the form
  hide(saveNoteBtn); // Hide the save button when the form is cleared
};

// Adjust button visibility based on input state
const handleRenderBtns = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn); // Hide save button if title or text is empty
  } else {
    show(saveNoteBtn); // Show save button when there's content
  }

  // Display the clear button once the user starts typing in either field
  if (noteTitle.value.trim() || noteText.value.trim()) {
    show(clearBtn); // Show clear button if there's any input
  } else {
    hide(clearBtn); // Hide clear button if no input
  }
};

// Populate notes list in sidebar
const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  noteList.innerHTML = ""; // Clear current list
  let noteItems = jsonNotes.length
    ? jsonNotes.map((note) => createLi(note.title, true, note))
    : [createLi("No saved Notes", false)];
  noteItems.forEach((note) => noteList.append(note));
};

// Create a list item for each note
const createLi = (text, hasDeleteBtn, noteData = null) => {
  const liEl = document.createElement("li");
  liEl.classList.add("list-group-item");
  liEl.setAttribute("data-note", JSON.stringify(noteData || {}));

  const spanEl = document.createElement("span");
  spanEl.classList.add("list-item-title");
  spanEl.innerText = text;
  spanEl.addEventListener("click", handleNoteView);
  liEl.append(spanEl);

  if (hasDeleteBtn) {
    const delBtnEl = document.createElement("i");
    delBtnEl.classList.add(
      "fas",
      "fa-trash-alt",
      "float-right",
      "text-danger",
      "delete-note"
    );
    delBtnEl.addEventListener("click", handleNoteDelete);
    liEl.append(delBtnEl);
  }
  return liEl;
};

// Fetch and render notes
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Event listeners for form controls
if (window.location.pathname === "/notes") {
  saveNoteBtn.addEventListener("click", handleNoteSave);
  newNoteBtn.addEventListener("click", handleNewNoteView);
  clearBtn.addEventListener("click", handleClearForm);
  noteTitle.addEventListener("keyup", handleRenderBtns);
  noteText.addEventListener("keyup", handleRenderBtns);
}

// Initial render of notes on page load
getAndRenderNotes();
