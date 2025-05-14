const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const itemsPath = path.join(__dirname, '../data/items.json');
const items = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'));


router.get('/', (req, res) => {
  const { id } = req.query;

  if (id && mockItems[id]) {
    res.json(mockItems[id]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

module.exports = router;