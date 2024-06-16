const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  const formData = req.body;
  
  const psvData = [
    formData.fullName,
    formData.email,
    formData.dob,
    formData.password,
    formData.confirmPassword,
    formData.age,
    formData.height,
    formData.gender,
    formData.weight,
    formData.medicalCondition,
    formData.personalHistory ? formData.personalHistory.join(',') : ''
  ].join(',');

  fs.appendFile('data.psv', psvData + '\n', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('https://localhost:3000'); // Redirect to https://localhost:3000 after successful form submission
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
