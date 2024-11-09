const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

// Initialize server components
const PORT = process.env.PORT || 3000;
const app = express();

// File handling with promisified readFile and writeFile
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Middleware for parsing JSON and serving static assets
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Load the index.html on the default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Load the notes.html for the /notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Fetch all saved notes from db.json
app.get("/api/notes", async (req, res) => {
  try {
    const data = await readFile("./db/db.json", "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading notes:", err);
    res.status(500).json({ error: "Error retrieving notes" });
  }
});

// Add a new note to db.json
app.post("/api/notes", async (req, res) => {
  try {
    const newNote = req.body;
    const data = await readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);

    // Generate a unique ID for the new note
    newNote.id = notes.length
      ? Math.max(...notes.map((note) => note.id)) + 1
      : 1;
    notes.push(newNote);

    await writeFile("./db/db.json", JSON.stringify(notes, null, 2));
    res.json(newNote);
  } catch (err) {
    console.error("Error saving note:", err);
    res.status(500).json({ error: "Error saving note" });
  }
});

// Update an existing note by ID
app.put("/api/notes", async (req, res) => {
  try {
    const updatedNote = req.body;
    const data = await readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);

    // Find the note by ID and update its content
    const noteIndex = notes.findIndex((note) => note.id === updatedNote.id);
    if (noteIndex !== -1) {
      notes[noteIndex] = updatedNote; // Update the note
      await writeFile("./db/db.json", JSON.stringify(notes, null, 2));
      res.json(updatedNote); // Return the updated note
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Error updating note" });
  }
});

// Delete a note by ID
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const data = await readFile("./db/db.json", "utf8");
    const notes = JSON.parse(data);

    // Filter out the note to be deleted
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    await writeFile("./db/db.json", JSON.stringify(updatedNotes, null, 2));
    res.json({ id: noteId });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Error deleting note" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
