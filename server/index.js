const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dynamicsRoutes = require('./routes/dynamics');
const salesforceRoutes = require('./routes/salesforce');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', dynamicsRoutes);
app.use('/api', salesforceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
