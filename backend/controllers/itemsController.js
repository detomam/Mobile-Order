const items = require('../data/locations.json');

exports.getItem = (req, res) => {
  const recipeNumber = req.query;

  if (recipeNumber) {
    const menuItem = items.filter(item => 
      item.recipe_number.includes(recipeNumber)
    );
    return res.json(menuItem);
  }
  res.json(items);
};