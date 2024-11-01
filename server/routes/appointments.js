const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/submit-appointment', (req, res) => {
  const { name, email, phone, address, selectedPests } = req.body;

  const sql = `INSERT INTO appointments (name, email, phone, address, selectedPests) VALUES (?, ?, ?, ?, ?)`;
  const params = [name, email, phone, JSON.stringify(selectedPests)];

  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error inserting appointment: ' + err.message);
      return res.status(500).json({ success: false, error: 'Failed to submit appointment' });
    }
    res.json({ success: true, id: this.lastID });
  });
});

module.exports = router;
