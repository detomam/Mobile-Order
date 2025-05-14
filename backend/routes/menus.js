const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const menusPath = path.join(__dirname, '../data/menus.json');
const menus = JSON.parse(fs.readFileSync(menusPath, 'utf-8'));


router.get('/menu', (req, res) => {
  const location_number = parseInt(req.query.location_number);

  if (isNaN(location_number)) {
    return res.status(400).json({ error: 'location_number is required and must be a number' });
  }

  const match = menus.find(menu => menu.location_number === location_number);

  if (!match) {
    return res.status(404).json({ error: "Hmm. We couldn't find a menu for this location." });
  }

  return res.json(match.menu);
});

module.exports = router;