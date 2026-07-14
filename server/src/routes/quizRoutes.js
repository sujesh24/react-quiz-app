const express = require("express");

const {
  getQuizByDocument,
  submitQuiz,
} = require("../controllers/quizController");

const router = express.Router();

router.get("/quiz/:documentId", getQuizByDocument);

router.post("/quiz/submit", submitQuiz);

module.exports = router;