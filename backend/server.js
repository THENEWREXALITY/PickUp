require('dotenv').config();
const express = require('express');
const pool = require('./db');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const usersRoute = require('./routes/users');
const accountsRoute = require('./routes/accounts');
const routesRoute = require('./routes/routes');
const transactionsRoute = require('./routes/transactions');
const adminRoute = require('./routes/admin');
const permissionsRoute = require('./routes/permissions');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/users', usersRoute);
app.use('/api/accounts', authenticateToken, accountsRoute);
app.use('/api/routes', authenticateToken, routesRoute);
app.use('/api/transactions', authenticateToken, transactionsRoute);
app.use('/api/admin', authenticateToken, requireAdmin, adminRoute);
app.use('/api/permissions', authenticateToken, permissionsRoute);

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database Connected:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
});