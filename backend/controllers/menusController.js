const menus = require('../data/menus.json');

exports.getMenu = (req, res) => {
  const locationNumber = req.query;

  if (locationNumber) {
    const menu = menus.filter(item => 
      item.location_number.includes(locationNumber)
    );
    if (menu) {
      return res.json(menu.menu);
    } 
    else {
      return res.status(404).json({ error: "Hmm. We couldn't find a menu for this location" });
    }
  }
  res.json(menus);

};