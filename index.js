const express = require("express");
const app = express();
const Sse = require("json-sse");
const cors = require("cors");

const port = 4000;

// setting up a fake db
const db = {};
db.messages = [];

const corsMiddleware = cors();
app.use(corsMiddleware);

const parser = express.json();
app.use(parser);

const stream = new Sse();

app.get("/stream", (req, res) => {
  const action = {
    type: "ALL_MESSAGES",
    payload: db.messages
  };

  // making new users download previous/old/past data that was already sent
  // stream.updateInit(db.messages);
  stream.updateInit(action);
  stream.init(req, res);
});

app.post("/message", (req, res) => {
  const { text } = req.body;
  db.messages.push(text);

  res.send(text);

  const action = {
    type: "NEW_MESSAGE",
    payload: text
  };

  // sending text to the stream as well
  stream.send(action);
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
