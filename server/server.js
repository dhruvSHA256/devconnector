const express = require('express');
const connectDB = require('./db');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json({ extended: false }));

app.get('/', (_req, res) => res.send('API running'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () => console.log(`Server Started on port: ${PORT}`));
