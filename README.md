# ToDoApp Modern JavaScript Project

A modern ToDo application built with pure JavaScript, leveraging both local storage and [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for data persistence and demonstration purposes.

## Features

- Add, toggle, and delete todo items
- Filter todos by All, Active, or Completed
- Persist todos in browser local storage
- Fetch initial todos from JSONPlaceholder API (first 10 todos)
- Responsive and interactive UI
- Mark todos as completed or active
- Clear all completed todos
- Loading and error message handling
- Smooth UI transitions for actions

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools required – just open the `index.html` file

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/thameurnasreddine/ToDoApp-Moderen-_JavaScript_project-.git
    cd ToDoApp-Moderen-_JavaScript_project-
    ```

2. Open `index.html` in your browser.

### Usage

- Type a todo and press Enter or click Add.
- Click "Complete" to toggle its status, or "Delete" to remove it.
- Use the filter buttons to view All, Active, or Completed todos.
- Click "Clear Completed" to remove all completed items.
- Todos are persisted in your browser (localStorage) and simulated via remote API.

### Project Structure

- `index.html` – Main HTML file
- `style.css` – Styling for the app
- `app.js` – Main JavaScript logic (shown above)

### Example JavaScript Core (Excerpt)

```js
const API_URL='https://jsonplaceholder.typicode.com/todos'
let todoState = [];
// ... (rest of your app.js logic)
```

## Credits

- UI/UX inspired by popular todo apps
- Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for demo API

## License

This project is open source and available under the [MIT License](LICENSE).