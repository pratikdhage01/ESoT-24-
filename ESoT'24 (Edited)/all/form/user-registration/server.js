const express = require('express');
const bodyParser = require('body-parser');
const fs = require('path');  // Using path module for file operations

const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets from the public folder
app.use(express.static('public'));

// Route handler for form submission (imported from routes/submit.js)
const submitRoute = require('./routes/submit.js');
app.use(submitRoute);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
