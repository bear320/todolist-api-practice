# todolist-api-practice

A vanilla Node.js Todo List API practice project built with the native `http` module. It implements basic CRUD endpoints for todos, uses UUIDs for todo ids, returns JSON responses, and includes CORS headers for browser or API client access.

## Tech Stack

- **Runtime:** Node.js 22.x
- **Module System:** ESM (`type: "module"`)
- **Server:** Native Node.js `http` module
- **ID Generator:** `uuid`
- **API Client Reference:** Postman collection

## Project Structure

```text
.
├── server.js                                   # HTTP server and /todos route handling
├── handlers.js                                 # Shared success / error JSON response helpers
├── headers.js                                  # CORS and JSON response headers
├── package.json                                # Project metadata, scripts, dependencies
├── package-lock.json
└── todolist_api_practice.postman_collection.json
                                                # Postman collection for testing the API
```

## Getting Started

### Prerequisites

- Node.js 22.x
- npm

### Install

```bash
npm install
```

### Run

```bash
npm start
```

The API starts on `http://localhost:3000` by default.

You can also provide a custom port:

```bash
PORT=3001 npm start
```

## Deployment

This API is deployed on Railway.

Production Base URL:

```text
https://todolist-api-practice-production.up.railway.app
```

For local development, use:

```text
http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the Todo API server with `node server.js` |
| `npm test` | Placeholder script; no automated tests are configured yet |

## API

Production Base URL:

```text
https://todolist-api-practice-production.up.railway.app
```

Local Base URL:

```text
http://localhost:3000
```

Main resource path:

```text
/todos
```

| Method | Path | Description | Body |
| --- | --- | --- | --- |
| `GET` | `/todos` | Get all todos | - |
| `POST` | `/todos` | Create a todo | `{ "title": "待辦事項1" }` |
| `PATCH` | `/todos/:id` | Update a todo title by id | `{ "title": "更新後的待辦事項" }` |
| `DELETE` | `/todos` | Delete all todos | - |
| `DELETE` | `/todos/:id` | Delete one todo by id | - |
| `OPTIONS` | Any path | CORS preflight response | - |

## Response Format

### Success

Most successful responses include a `message` and `data` field:

```json
{
  "message": "Todos fetched successfully",
  "data": []
}
```

Created todo example:

```json
{
  "message": "New todo created successfully",
  "data": {
    "id": "9f4d0f3b-5f7a-4d9c-91de-4e7f2d7f9b1a",
    "title": "待辦事項1"
  }
}
```

### Error

Error responses include a `message` field:

```json
{
  "message": "Title is required and must be a non-empty string"
}
```

Common error messages:

| Status | Message | When it happens |
| --- | --- | --- |
| `400` | `Invalid JSON format` | `POST /todos` receives invalid JSON |
| `400` | `Invaild JSON format` | `PATCH /todos/:id` receives invalid JSON |
| `400` | `Title is required and must be a non-empty string` | `title` is missing, not a string, or empty |
| `404` | `Todo not found` | The todo id does not exist |
| `404` | `Endpoint not found` | The route is not supported |
| `500` | `Internal service error` | Unexpected server error |

> Note: `DELETE /todos` currently returns HTTP `400` with the message `All todos deleted successfully` because that is the status code used in `server.js`.

## Examples

### Get all todos

```bash
BASE_URL=https://todolist-api-practice-production.up.railway.app

curl $BASE_URL/todos
```

### Create a todo

```bash
BASE_URL=https://todolist-api-practice-production.up.railway.app

curl -X POST $BASE_URL/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"待辦事項1"}'
```

### Update a todo

Replace `<todo-id>` with the id returned from `POST /todos`.

```bash
BASE_URL=https://todolist-api-practice-production.up.railway.app

curl -X PATCH $BASE_URL/todos/<todo-id> \
  -H "Content-Type: application/json" \
  -d '{"title":"更新後的待辦事項"}'
```

### Delete one todo

```bash
BASE_URL=https://todolist-api-practice-production.up.railway.app

curl -X DELETE $BASE_URL/todos/<todo-id>
```

### Delete all todos

```bash
BASE_URL=https://todolist-api-practice-production.up.railway.app

curl -X DELETE $BASE_URL/todos
```

## Postman Collection

This repo includes a Postman collection:

```text
todolist_api_practice.postman_collection.json
```

The collection contains requests for:

- Getting all todos
- Creating a todo
- Updating one todo
- Deleting all todos
- Deleting one todo

The collection includes a `baseUrl` variable that points to the deployed Railway API:

```text
https://todolist-api-practice-production.up.railway.app
```

You can change `baseUrl` to `http://localhost:3000` when testing locally.

## Data Storage

Todos are stored in the in-memory `todos` array inside `server.js`.

That means:

- Data resets whenever the server restarts.
- No database is required.
- This project is best used for API routing, request handling, and Node.js practice.

## Notes

- `headers.js` enables CORS for `GET`, `POST`, `PATCH`, `DELETE`, and `OPTIONS`.
- `handlers.js` centralizes JSON success and error responses.
- `server.js` is the main entry point for the Todo API.
