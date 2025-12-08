const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const app = express();
const cors = require("cors");
initializeDatabase();

const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOption));

app.use('/agents', require("./routes/agent"))
app.use('/leads', require("./routes/lead"))
app.use('/leads', require("./routes/comment"));

app.get("/", (req, res) => {
  res.send("Welcome to express home!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`);
});
