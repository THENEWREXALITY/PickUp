const pool = require('../db');

async function topUp(req, res) {
  const amount = Number(req.body.amount);
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'A positive amount is required' });
  }
  if (amount > 500) {
    return res.status(400).json({ error: 'Maximum top-up is K500' });
  }

  try {
    const result = await pool.query(
      'UPDATE accounts SET balance = balance + $1 WHERE user_id = $2 RETURNING balance',
      [amount, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

async function getBalance(req, res) {
  try {
    const result = await pool.query('SELECT balance FROM accounts WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json({ balance: result.rows[0].balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { topUp, getBalance };