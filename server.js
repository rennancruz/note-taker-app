const fs = require("fs");
const express = require("express");
const port = process.env.PORT || 3001;
const path = require("path");
const db = require("./db/db.json");
const app = express();
const uuid = require("./helpers/uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      const currentNotes = JSON.parse(data);
      res.json(currentNotes);
    }
  });
});
app.get("/jss", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/js/index.js"))
);
app.get("/css", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/css/styles.css"))
);
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  //res.status(200).json(`${req.method} request was received notes in coming`);
  //console.info(`${req.method} request was received notes in coming`);
});
// this post is to make a new note and save the one already made
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request to make a new note recieved`);

  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // reading the database
    fs.readFile("./db/db.json", "utf8", (error, data) => {
      if (error) {
        console.log(error);
      } else {
        const currentNotes = JSON.parse(data);
        currentNotes.push(newNote);
        console.log(currentNotes);
        const noteString = JSON.stringify(currentNotes);
        fs.writeFile("./db/db.json", noteString, (err) =>
          err ? console.error(err) : console.info("We made a new Note!")
        );
      }
    });
    const response = {
      status: "success",
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in making note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      const currentNotes = JSON.parse(data);
      const filterNotes = currentNotes.filter((note) => {
        return note.id !== id;
      });
      console.log(filterNotes);
      const noteString = JSON.stringify(filterNotes);
      fs.writeFile("./db/db.json", noteString, (err) =>
        err ? console.error(err) : console.info("We made a new Note!")
      );
    }
  });
  const response = {
    status: "success",
  };
  console.log(response);
  res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
