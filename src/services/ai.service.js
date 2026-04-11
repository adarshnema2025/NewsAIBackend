const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateSummary = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Summarize the following news article into exactly 3-4 concise bullet points.

Return ONLY the bullet points.
Do NOT include any introduction, heading, or extra text.

${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("AI Summary Error:", error.message);
    throw new Error("Failed to generate summary");
  }
};