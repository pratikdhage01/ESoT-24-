const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 3000;

// Setup Generative AI
const apiKey = process.env.GEMINI_API_KEY; // Ensure this is set in your environment
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

  if (!symptoms || !Array.isArray(symptoms)) {
    return res.status(400).send('Invalid symptoms data');
  }

  const data = `${symptoms.join('|')}\n`;

  fs.appendFile('submissions.psv', data, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Symptoms submitted successfully!');
    }
  });
});

// Function to process PSV file
async function processPSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: '|', columns: false, trim: true }))
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

    if (psvData.length === 0) {
      return res.status(3000).send('No data available in the PSV file');
    }

    // Example of using the first record's content as input
    const firstRecord = psvData[0];
    const inputText = `input: ${Object.values(firstRecord).join(', ')}`;

    const parts = [
      { text: inputText },
      { text: "output: " },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    const generatedOutput = result.response.text();
    res.send(generatedOutput);
  } catch (err) {
    console.error('Error generating content:', err);
    res.status(500).send('Error generating content');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
