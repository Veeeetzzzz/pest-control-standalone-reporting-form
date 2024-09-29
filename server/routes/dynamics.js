const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/submit-to-dynamics', async (req, res) => {
  try {
    const dynamicsApiUrl = process.env.DYNAMICS_API_URL;
    const dynamicsApiKey = process.env.DYNAMICS_API_KEY;
    
    const response = await axios.post(
      `${dynamicsApiUrl}your_entity_name`,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${dynamicsApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Dynamics API error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit to Dynamics' });
  }
});

module.exports = router;
