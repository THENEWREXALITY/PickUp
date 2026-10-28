const pool = require('../db');

async function createRoute(req, res) {
  const { operator_id, name, fare_amount } = req.body;
  if (!operator_id || !name || !fare_amount) {
    return res.status(400).json({ error: 'operator_id, name, and fare_amount are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO routes (operator_id, name, fare_amount) VALUES ($1, $2, $3) RETURNING *',
      [operator_id, name, fare_amount]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function listRoutes(req, res) {
  try {
    const result = await pool.query('SELECT * FROM routes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function updateRoute(req, res) {
  const { name, fare_amount } = req.body;
  try {
    const result = await pool.query(
      'UPDATE routes SET name = COALESCE($1, name), fare_amount = COALESCE($2, fare_amount) WHERE id = $3 RETURNING *',
      [name, fare_amount, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function deleteRoute(req, res) {
  try {
    const result = await pool.query('DELETE FROM routes WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { createRoute, listRoutes, updateRoute, deleteRoute };