# Note-Taking App

A simple and intuitive note-taking application built using **Express.js**, **HTML**, **CSS**, and **JavaScript**. This app allows users to create, edit, and delete notes, as well as view and manage them in a sidebar interface.

---
## Demo

https://github.com/user-attachments/assets/bca648f9-91c0-41cf-a82d-6b17e2a25538

---

## Features

- **Create Notes**: Easily create new notes with a title and text content.
- **Edit Notes**: View and edit existing notes, and save changes with a single click.
- **Delete Notes**: Remove notes from the app with a straightforward delete option.
- **Responsive UI**: Works seamlessly on both desktop and mobile devices.
- **Persistent Storage**: Notes are saved to a `db.json` file for persistent storage across sessions.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Express.js (for routing and API handling)
- **Data Storage**: JSON file (`db.json`) for storing notes
- **Font Awesome**: For icons used in the interface (delete button, etc.)

---

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   ```

1. Navigate to the project folder:
   ```bash
   npm install
   ```
1. Start the application:
   ```bash
   npm start
   ```
1. Open your browser and navigate to http://localhost:3000 to access the app.

---

## How to Use

1. Creating a New Note: Click on the "New Note" button to begin creating a new note. Enter a title and text, then click "Save Note" to save it.
1. Editing an Existing Note: Click on any note from the sidebar to view and edit it. Make changes and click "Save Changes" to update the note.
1. Deleting a Note: Hover over a note in the sidebar and click the trash icon to delete it.
1. Clearing the Form: If you want to start over, click the "Clear Form" button to reset the title and text fields.

---

## File Structure

```bash
/public
    /css
    /js
    /index.html
    /notes.html
/db
    /db.json
/helpers
    /uuid.js
server.js
package.json
```

---

## API Routes

- GET /api/notes: Retrieve all notes from the database.
- POST /api/notes: Create a new note and save it to the database.
- PUT /api/notes: Update an existing note in the database.
- DELETE /api/notes/:id: Delete a note by its ID.

---

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
