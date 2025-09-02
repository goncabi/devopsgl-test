const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World v3 🚀');
});

// This check ensures the server only starts when the file is run directly
// and not when it's imported by a test file.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Hello World app listening on port ${port}`);
  });
}

module.exports = app; // Export for testing

//test1