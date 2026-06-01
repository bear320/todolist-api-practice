import { headers } from "./headers.js";

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(body));
};

export const successHandler = (res, statusCode = 200, data = null, message) => {
  if (typeof statusCode !== "number") {
    sendJson(res, 500, {
      message: "Internal service error",
    });
    return;
  }

  const resBody = message ? { message, data } : { data };

  sendJson(res, statusCode, resBody);
};

export const errorHandler = (res, statusCode = 500, message = "Internal service error", errors) => {
  if (typeof statusCode !== "number" || typeof message !== "string") {
    sendJson(res, 500, "Internal service error");
    return;
  }

  const resBody = errors ? { message, errors } : { message };

  sendJson(res, statusCode, resBody);
};
