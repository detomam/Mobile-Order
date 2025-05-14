const express = require('express');
const cors = require('cors');
const locationsRouter = require('./routes/locations');
const itemsRouter = require('./routes/items');
const menusRouter = require('./routes/menus');
const ordersRouter = require('./routes/orders');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/', locationsRouter);
app.use('/', itemsRouter);
app.use('/', menusRouter);
app.use('/', ordersRouter);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});