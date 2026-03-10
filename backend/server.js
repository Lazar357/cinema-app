const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API radi" });
});

app.listen(3000, () => {
  console.log("Server radi na portu 3000");
});
