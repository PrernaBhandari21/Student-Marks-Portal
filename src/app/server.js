const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// An array to store the submitted data
let submittedData = [];

app.post('/api/reportData', (req, res) => {
    const data = req.body;
    console.log("data received is:", data);
    
    // Add the submitted data to the array
    submittedData.push(data);

    // Send back the submitted data as a response
    res.json({ message: 'Data received!', data: data });
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

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
