const pool = require('../db');

async function getSummary(req, res) {
  try {
    const totals = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_revenue, COUNT(*) AS total_rides FROM transactions'
    );
    const perRoute = await pool.query(
      `SELECT r.id, r.name, COUNT(t.id) AS rides, COALESCE(SUM(t.amount), 0) AS revenue
       FROM routes r
       LEFT JOIN transactions t ON t.route_id = r.id
       GROUP BY r.id, r.name
       ORDER BY revenue DESC`
    );
    res.json({ ...totals.rows[0], routes: perRoute.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getRecentTransactions(req, res) {
  try {
    const result = await pool.query(
      `SELECT t.id, t.amount, t.created_at, r.name AS route_name, u.name AS commuter_name
       FROM transactions t
       JOIN routes r ON r.id = t.route_id
       JOIN accounts a ON a.id = t.account_id
       JOIN users u ON u.id = a.user_id
       ORDER BY t.created_at DESC
       LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getDrivers(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name,
              COUNT(DISTINCT p.route_id) AS routes,
              COALESCE(SUM(t.amount), 0) AS earnings
       FROM users u
       LEFT JOIN route_permissions p ON p.driver_id = u.id AND p.status = 'approved'
       LEFT JOIN transactions t ON t.route_id = p.route_id
       WHERE u.role = 'driver'
       GROUP BY u.id, u.name ORDER BY earnings DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { getSummary, getRecentTransactions, getDrivers };