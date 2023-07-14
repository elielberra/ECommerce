const express = require("express");
const { api } = require("./src/routes");

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use('/api', api)

port = 8080;
app.listen(port, () => console.log(`Local server listening on port ${port}`));