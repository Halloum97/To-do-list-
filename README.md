# To-Do List App

A simple browser-based To-Do List application built with **HTML**, **CSS**, and **JavaScript**.

## Features

- Add new tasks
- Mark tasks as completed
- Edit existing tasks
- Delete tasks
- Track progress with a counter and progress bar
- Save tasks with `localStorage` so they persist after page refresh

## Project Structure

- `Index.html` — App layout and UI structure
- `styles.css` — Visual styling
- `app.js` — App logic and task management
- `bin.png` / `edit.jpg` — Action icons

## How to Run

### Option 1: Open directly

1. Open `Index.html` in your browser.

### Option 2: Run with a local server (recommended)

```bash
npx http-server . -p 8080
```

Then open:

- `http://localhost:8080`

## How It Works

- Tasks are stored in an array of objects (`text`, `completed`).
- The task list is rendered dynamically into the DOM.
- Any change (add/edit/delete/toggle) updates the UI and statistics.
- Data is saved to and restored from `localStorage` using JSON.

## Skills Demonstrated

- Semantic HTML structure
- CSS variables and layout with Flexbox
- JavaScript DOM manipulation
- Event handling
- State management with arrays/objects
- Browser storage with `localStorage`

## Future Improvements

- Add due dates and categories
- Add filters (all / active / completed)
- Add keyboard shortcuts and accessibility improvements
- Add unit tests

---

Created as a front-end practice project.
