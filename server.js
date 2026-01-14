const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Static files
app.use(express.static('public'));

// Routes
const urlsRouter = require('./routes/urls');
const redirectRouter = require('./routes/redirect');

// Order matters: API routes first, then dynamic short code redirect
app.use('/', urlsRouter);
app.use('/', redirectRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
