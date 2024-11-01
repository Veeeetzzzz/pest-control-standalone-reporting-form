const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'appointments.db'), (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      selectedPests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table ' + err.message);
      }
    });
  }
});

module.exports = db;
