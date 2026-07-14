const pool = require("../config/db");

//get quiz by document id
const getQuizByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        question,
        option_a,
        option_b,
        option_c,
        option_d
      FROM questions
      WHERE document_id = $1
      ORDER BY id
      `,
      [documentId]
    );

    res.status(200).json({
      success: true,
      quiz: result.rows,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    let score = 0;

    for (const answer of answers) {
      const result = await pool.query(
        `
        SELECT correct_answer
        FROM questions
        WHERE id = $1
        `,
        [answer.questionId]
      );

      if (result.rows.length === 0) {
        continue;
      }

      if (result.rows[0].correct_answer === answer.selected) {
        score++;
      }
    }

    res.status(200).json({
      success: true,
      score,
      total: answers.length,
      percentage: (score / answers.length) * 100,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getQuizByDocument,
  submitQuiz,
};