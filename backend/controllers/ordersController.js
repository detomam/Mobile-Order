const orders = require('../data/orders.json');

exports.sendOrder = (req, res) => {
  const orderData = req.body;
  
      let orders = [];
      try {
        const data = fs.readFileSync(ordersPath, 'utf-8');
        orders = JSON.parse(data);
      } catch (err) {
        console.error('Error reading orders file:', err);
        return res.status(500).json({ error: 'Could not read orders file' });
      }
  
      orders.push(orderData);
  
      try {
          fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
          res.status(200).json({ message: 'Order saved successfully', order: orderData });
        } catch (err) {
          console.error('Error writing to orders file:', err);
          res.status(500).json({ error: 'Could not save order' });
        }

};