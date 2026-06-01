const express = require('express');
const cors = require('cors');
const registerAdminRoutes = require('./routes/admin');
const registerResumeRoutes = require('./routes/resume');

function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json());

  registerAdminRoutes(app);
  registerResumeRoutes(app);

  return app;
}

module.exports = createApp();