const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3500;

// Setup Generative AI
const apiKey = process.env.GEMINI_API_KEY;
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

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to submit symptoms
app.post('/submit', (req, res) => {
  const { symptoms } = req.body;
  const data = `${symptoms.join('|')}\n`;

  fs.appendFile('submissions.psv', data, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Thank you for your submission!');
    }
  });
});

// Function to process PSV file
async function processPSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: '|', columns: true, trim: true }))
      .on('data', (row) => {
        records.push(row);
      })
      .on('end', () => {
        resolve(records);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Route to generate content from the PSV file
app.get('/generate', async (req, res) => {
  const filePath = path.join(__dirname, 'submissions.psv');
  let psvData;

  try {
    psvData = await processPSVFile(filePath);
  } catch (err) {
    console.error('Error reading PSV file:', err);
    return res.status(500).send('Internal Server Error');
  }

  if (psvData.length === 0) {
    return res.status(400).send('No data available in the PSV file');
  }

  // Example of using the first record's content as input
  const firstRecord = psvData[0];
  const inputText = `input: ${Object.values(firstRecord).join(', ')}`;

  const parts = [
    { text: inputText },
    { text: "output: " },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
    });
    res.send(result.response.text());
  } catch (err) {
    console.error('Error generating content:', err);
    res.status(500).send('Error generating content');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
