const express = require('express');

const handleFormSubmit = (req, res) => {
  const formData = req.body;

  // Combine selected personal history options
  const personalHistory = formData.personalHistory ? formData.personalHistory.join(',') : '';

  // Construct data string separated by pipes
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
    medicalCondition = formData.medicalCondition || 'None',  // Default medical condition if not selected
    personalHistory
  ].join('|');

  // Define file path (replace with your desired location)
  const filePath = fs.join(__dirname, '../data.psv');  // Use path module for file path

  fs.appendFile(filePath, psvData + '\n', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('https://localhost:3000'); // Redirect to form after submission
    }
  });
};

module.exports = express.Router()
  .post('/submit', handleFormSubmit);
''