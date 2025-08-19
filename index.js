const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World v2 🚀');
});
app.listen(process.env.PORT || 8080);
