const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ordersPath = path.join(__dirname, '../data/orders.json');
const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));


router.post('/order', (req, res) => {
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
        res.status(200).json({ message: 'Order saved successfully', order_data: orderData });
      } catch (err) {
        console.error('Error writing to orders file:', err);
        res.status(500).json({ error: 'Could not save order' });
      }
});

module.exports = router;