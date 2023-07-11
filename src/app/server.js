const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();


const client = new Client({
  user: 'techbets',
  host: 'localhost',
  database: 'reportData',
  password: 'techbets',
  port: 5432, // default port for PostgreSQL
});

module.exports = {
  client: client,
};

//Parse Json Bodies
//to parse too large data size
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));


client.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to database');
  }
});

client.on('end', () => {
  console.log('Disconnected from database');
});

//client querry 
app.post('/api/reportData', async (req, res) => {
  const data = req.body;
  console.log("Data received is:", data);

  try {
    console.log("Inserting data into table:", data);

    // Insert the data into the "reportData" table
    const insertQuery = 'INSERT INTO "reportData" (name, "studentDetails", "studentResponse", "answerKey") VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)';
    const insertValues = [data.reportName, JSON.stringify(data.studentDetails), JSON.stringify(data.studentResponses), JSON.stringify(data.answerKey)];
    const result = await client.query(insertQuery, insertValues);

    console.log("Data saved to the database:", data);
    console.log("Result =>", result);

    // Send back the submitted data as a response
    res.json({ message: 'Data received and saved to the database!', data: data });
  } catch (err) {
    console.log("Cannot send data:", data);
    console.error("Error saving data to the database:", err);
    if (err.code === '23505') {
      // Duplicate key error (unique constraint violation)
      res.status(409).json({ message: 'Data with the same name already exists!', data: data });
    } else {
      res.status(500).json({ message: 'Error saving data to the database', data: data, error: err });
    }
  }
});



app.get('/api/reportData', async (req, res) => {
  const name = req.query.name; // Retrieve the 'name' value from the query parameter
  
  try {
    let query = 'SELECT * FROM "reportData"';
    let values = [];

    if (name) {
      query += ' WHERE name = $1';
      values.push(name);
    }

    const result = await client.query(query, values);
    const data = result.rows;
    res.json({ receivedData: data });
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).json({ message: 'Error retrieving data from database', error: err });
  }
});

//delete
app.delete('/api/reportData', async (req, res) => {
  try {
    // Delete all items from the "reportData" table
    const query = 'DELETE FROM "reportData"';
    const result = await client.query(query);

    console.log("All data deleted from the database");
    console.log("Result =>", result);

    res.json({ message: "All data deleted from the database" });
  } catch (err) {
    console.error("Error deleting data from the database:", err);
    res.status(500).json({ message: 'Error deleting data from the database', error: err });
  }
});


// Route handler for the root URL
app.get('/api', (req, res) => {
    res.send('Welcome to my API server!');
});

const PORT = process.env.PORT || 400;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
