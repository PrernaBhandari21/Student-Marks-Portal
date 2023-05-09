const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/reportData', (req, res) => {
    const data = req.body;
    console.log("dataa received is :",data);
    res.json({ message: 'Data received!',
data : data });
});

// Add a route handler for the root URL
app.get('/API', (req, res) => {
    res.send('Welcome to my API aserver!');
  });

  
const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
