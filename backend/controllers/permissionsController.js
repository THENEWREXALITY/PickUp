const pool = require('../db');

async function requestPermission(req, res) {
  const { routeId } = req.body;
  if (!routeId) return res.status(400).json({ error: 'routeId is required' });
  try {
    const result = await pool.query(
      `INSERT INTO route_permissions (driver_id, route_id) VALUES ($1, $2)
       ON CONFLICT (driver_id, route_id)
       DO UPDATE SET status = 'pending', created_at = NOW()
       WHERE route_permissions.status = 'rejected'
       RETURNING *`,
      [req.user.id, routeId]
    );
    if (result.rows.length === 0) return res.status(409).json({ error: 'Already requested' });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23503') return res.status(404).json({ error: 'Route not found' });
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getMyPermissions(req, res) {
  try {
    const result = await pool.query(
      `SELECT p.id, p.status, p.route_id, r.name, r.fare_amount
       FROM route_permissions p JOIN routes r ON r.id = p.route_id
       WHERE p.driver_id = $1 ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getDriverSummary(req, res) {
  try {
    const result = await pool.query(
      `SELECT r.id, r.name, COUNT(t.id) AS rides, COALESCE(SUM(t.amount), 0) AS revenue
       FROM route_permissions p
       JOIN routes r ON r.id = p.route_id
       LEFT JOIN transactions t ON t.route_id = r.id
       WHERE p.driver_id = $1 AND p.status = 'approved'
       GROUP BY r.id, r.name ORDER BY revenue DESC`,
      [req.user.id]
    );
    const total_collected = result.rows.reduce((sum, r) => sum + Number(r.revenue), 0);
    const total_rides = result.rows.reduce((sum, r) => sum + Number(r.rides), 0);
    res.json({ total_collected, total_rides, routes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getPending(req, res) {
  try {
    const result = await pool.query(
      `SELECT p.id, p.created_at, u.name AS driver_name, r.name AS route_name
       FROM route_permissions p
       JOIN users u ON u.id = p.driver_id
       JOIN routes r ON r.id = p.route_id
       WHERE p.status = 'pending' ORDER BY p.created_at`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function decide(req, res) {
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }
  try {
    const result = await pool.query(
      'UPDATE route_permissions SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Request not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { requestPermission, getMyPermissions, getDriverSummary, getPending, decide };