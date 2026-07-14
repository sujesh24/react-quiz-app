const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateQuiz = async (text) => {
  const prompt = `
Generate exactly 5 multiple-choice questions from the document.

Rules:
- Return ONLY a JSON array.
- Do not use markdown.
- Do not use \`\`\`json.
- Each question must contain:
  - question
  - options (exactly 4 options)
  - answer

The "answer" field MUST be ONLY one of:
"A", "B", "C", or "D"

Example:

[
  {
    "question": "What is Flutter?",
    "options": [
      "Framework",
      "Database",
      "Language",
      "IDE"
    ],
    "answer": "A"
  }
]

Document:
${text}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  let quizText = response.text.trim();

  // Remove markdown if Gemini adds it
  quizText = quizText
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(quizText);
};

module.exports = {
  generateQuiz,
};