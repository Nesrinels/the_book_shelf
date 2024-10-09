const express = require('express');
const app = express();


app.get("/", (req, res) => {
    res.send("Hello World!");
});
//creating Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
