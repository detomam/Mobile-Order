const locations = require('../data/locations.json');

exports.getLocations = (req, res) => {

  res.json(locations);

};