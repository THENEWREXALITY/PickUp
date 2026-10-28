const pool = require('../db');

async function payFare(req, res) {
  const { routeId } = req.body;
  const userId = req.user.id;

  if (!routeId) return res.status(400).json({ error: 'routeId is required' });

  try {
    const routeResult = await pool.query('SELECT * FROM routes WHERE id = $1', [routeId]);
    if (routeResult.rows.length === 0) return res.status(404).json({ error: 'Invalid route' });
    const fare = routeResult.rows[0].fare_amount;

    const accountResult = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [userId]);
    const account = accountResult.rows[0];

    if (parseFloat(account.balance) < parseFloat(fare)) {
      return res.status(402).json({ error: 'Insufficient balance' });
    }

    const updateResult = await pool.query(
  'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2 AND balance >= $1 RETURNING balance',
    [fare, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(402).json({ error: 'Insufficient balance' });
    }

    await pool.query(
      'INSERT INTO transactions (account_id, route_id, amount) VALUES ($1, $2, $3)',
      [account.id, routeId, fare]
    );

    res.json({
  balance: updateResult.rows[0].balance,
  fareCharged: fare,
  routeName: routeResult.rows[0].name,
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getHistory(req, res) {
  try {
    const result = await pool.query(
      `SELECT T.id, t.amount, t.created_at, r.name AS route_name
      FROM transactions t
      JOIN accounts a ON a.id = t.account_id
      Join routes r ON r.id = t.route_id
      WHERE a.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT 20`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { payFare, getHistory };