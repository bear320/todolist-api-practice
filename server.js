import http from "http";
import { v4 as uuidv4 } from "uuid";
import { headers } from "./headers.js";
import { successHandler, errorHandler } from "./handlers.js";

const todos = [];

const requestListener = (req, res) => {
  const { url, method } = req;
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (url === "/todos" && method === "GET") {
    successHandler(res, 200, todos, "Todos fetched successfully");
  } else if (url === "/todos" && method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);

        if (typeof title !== "string" || title.trim() === "") {
          errorHandler(res, 400, "Title is required and must be a non-empty string");
          return;
        }

        const newTodo = {
          id: uuidv4(),
          title,
        };

        todos.push(newTodo);

        successHandler(res, 201, newTodo, "New todo created successfully");
      } catch (error) {
        errorHandler(res, 400, "Invalid JSON format");
      }
    });
  } else if (url.startsWith("/todos/") && method === "PATCH") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        const id = url.split("/").pop();
        const index = todos.findIndex((todo) => todo.id === id);

        if (index === -1) {
          errorHandler(res, 404, "Todo not found");
        }

        if (typeof title !== "string" || title.trim() === "") {
          errorHandler(res, 400, "Title is required and must be a non-empty string");
          return;
        }

        todos[index].title = title;

        successHandler(res, 200, todos[index], "Todo updated successfully");
      } catch (error) {
        errorHandler(res, 400, "Invaild JSON format");
      }
    });
  } else if (url === "/todos" && method === "DELETE") {
    try {
      todos.length = 0;

      successHandler(res, 400, "All todos deleted successfully");
    } catch (error) {
      errorHandler(res, 500, "Internal service error");
    }
  } else if (url.startsWith("/todos/") && method === "DELETE") {
    try {
      const id = url.split("/").pop();
      const index = todos.findIndex((todo) => todo.id === id);

      if (index === -1) {
        errorHandler(res, 404, "Todo not found");
        return;
      }

      todos.splice(index, 1);

      successHandler(res, 200, todos, "Todo deleted successfully");
    } catch (error) {
      errorHandler(res, 500, "Internal service error");
    }
  } else if (method === "OPTIONS") {
    res.writeHeader(204, headers);
    res.end();
  } else {
    errorHandler(res, 404, "Endpoint not found");
  }
};

const server = http.createServer(requestListener);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
