// Define DOM elements only if on notes page
let noteForm, noteTitle, noteText, saveNoteBtn, newNoteBtn, clearBtn, noteList;
if (window.location.pathname === "/notes") {
  noteForm = document.querySelector(".note-form");
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteBtn = document.querySelector(".save-note");
  newNoteBtn = document.querySelector(".new-note");
  clearBtn = document.querySelector(".clear-btn");
  noteList = document.querySelectorAll(".list-container .list-group");
}

let activeNote = {}; // Variable to store the currently active note

// Fetch all notes from the server
const getNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

// Save a new note
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });

// Delete a note by ID
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

// Render the current note in the form
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);
  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
};

// Save the note, then re-render the note list
const handleNoteSave = () => {
  const newNote = { title: noteTitle.value, text: noteText.value };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Handle note deletion
const handleNoteDelete = (e) => {
  e.stopPropagation();
  const noteId = JSON.parse(
    e.target.parentElement.getAttribute("data-note")
  ).id;

  // If the active note is being deleted, clear the active note
  if (activeNote.id === noteId) activeNote = {};

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Show a specific note when selected from the list
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderActiveNote();
};

// Prepare the form for a new note
const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Adjust button visibility based on note state
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() || !noteText.value.trim()) hide(saveNoteBtn);
  else show(saveNoteBtn);
};

// Populate the notes list in the sidebar
const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  noteList.forEach((el) => (el.innerHTML = "")); // Clear existing notes
  let noteListItems = jsonNotes.length
    ? jsonNotes.map((note) => createLi(note.title, true, note))
    : [createLi("No saved Notes", false)];

  noteListItems.forEach((note) => noteList[0].append(note));
};

// Create a list item element
const createLi = (text, hasDeleteBtn, noteData = null) => {
  const liEl = document.createElement("li");
  liEl.classList.add("list-group-item");

  const spanEl = document.createElement("span");
  spanEl.classList.add("list-item-title");
  spanEl.innerText = text;
  if (noteData) liEl.dataset.note = JSON.stringify(noteData);

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

// Get notes from the server and render them
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Event listeners for note interactions
if (window.location.pathname === "/notes") {
  saveNoteBtn.addEventListener("click", handleNoteSave);
  newNoteBtn.addEventListener("click", handleNewNoteView);
  noteTitle.addEventListener("keyup", handleRenderBtns);
  noteText.addEventListener("keyup", handleRenderBtns);
  clearBtn.addEventListener("click", handleNewNoteView);
}

// Initial call to display all notes on page load
getAndRenderNotes();
