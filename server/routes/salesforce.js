const express = require('express');
const router = express.Router();
const jsforce = require('jsforce');

router.post('/submit-to-salesforce', async (req, res) => {
  try {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SF_LOGIN_URL
    });

    await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN);

    const result = await conn.sobject('Case').create(req.body);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Salesforce API error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit to Salesforce' });
  }
});

module.exports = router;
