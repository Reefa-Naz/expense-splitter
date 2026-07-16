const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/settlements', require('./routes/settlements'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));