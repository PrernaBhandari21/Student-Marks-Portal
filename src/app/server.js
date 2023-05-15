const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// Create a pool of database connections
const pool = new Pool({
    user: 'techbets',
    host: 'localhost',
    database: 'reportData',
    password: 'techbets',
    port: 5432, // default port for PostgreSQL
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// An array to store the submitted data
let submittedData = [];

// app.post('/api/reportData', (req, res) => {
//     const data = req.body;
//     console.log("data received is:", data);
    
//     // Add the submitted data to the array
//     submittedData.push(data);

//     // Send back the submitted data as a response
//     res.json({ message: 'Data received!', data: data });
// });

app.post('/api/reportData', async (req, res) => {
    const data = req.body;
    console.log("data received is:", data);

    // Add the submitted data to the array
    submittedData.push(data);
  
    try {
        console.log("inserting data in table=>", data);

      // Insert the submitted data into the "reportData" table
      const result = await pool.query('INSERT INTO "reportData" (name, "studentDetails", "studentResponse", "answerKey") VALUES ($1, $2, $3, $4)', [data.reportName, data.studentDetails, data.studentResponses, data.answerKey]);
      console.log("Data saved to database:", data);
  
      console.log("Result=>", result);
      // Send back the submitted data as a response
      res.json({ message: 'Data received and saved to database!', data: data });
    } catch (err) {
        console.log("cannot send data=>", data);
      console.error("Error saving data to database:", err);
      res.status(500).json({ message: 'Error saving data to database' , data:data});
    }
  });

// Route handler to display all the submitted data
app.get('/api/reportData', (req, res) => {
    // Send back the array of submitted data as a response
    res.json(submittedData);
});

// Route handler for the root URL
app.get('/api', (req, res) => {
    res.send('Welcome to my API server!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
