const pool = require("../config/db");
const { extractPdfText } = require("../services/pdfService");
const { generateQuiz } = require("../services/geminiService");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

const documentResult = await pool.query(
  `
  INSERT INTO documents (file_name, file_type)
  VALUES ($1, $2)
  RETURNING id
  `,
  [
    req.file.originalname,
    req.file.mimetype,
  ]
);

const documentId = documentResult.rows[0].id;

    const extractedText = await extractPdfText(req.file.path);

    const quiz = await generateQuiz(extractedText);
    for (const item of quiz) {
  await pool.query(
    `
    INSERT INTO questions
    (
      document_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      documentId,
      item.question,
      item.options[0],
      item.options[1],
      item.options[2],
      item.options[3],
      item.answer,
    ]
  );
}

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: req.file,
      quiz,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};