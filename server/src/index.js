const express = require('express');
const cors = require('cors');
require('dotenv').config();

const uploadRoutes = require("./routes/uploadRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", quizRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});