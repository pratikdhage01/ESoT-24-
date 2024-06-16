require('dotenv').config();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('API key is not set. Please set the GEMINI_API_KEY environment variable.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "tunedModels/medical-gemini-34n8bs7sjbmk",
});

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 0,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const parts = [
    { text: "input: irritability, depression, stiff neck, excessive hunger, blurred and distorted vision, headache" },
    { text: "output: " },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    console.log(result.response.text);
  } catch (error) {
    console.error('Error generating content:', error);
  }
}

run();
