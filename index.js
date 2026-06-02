const express = require('express');
const app = express();
app.use(express.json());
const port = 2108

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Library Management System');
});


app.use((req, res) => {
    res.status(500).send('Not Built Yet: Server Error');
});

app.listen(port, () => {
    console.log(`Library Management System is running on http://localhost:${port}`);
});