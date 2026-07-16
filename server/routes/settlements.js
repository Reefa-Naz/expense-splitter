const express = require('express');
const Settlement = require('../models/Settlement');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ADD settlement
router.post('/', auth, async (req, res) => {
  try {
    const { groupId, paidTo, amount } = req.body;
    const settlement = new Settlement({
      group: groupId,
      paidBy: req.userId,
      paidTo,
      amount
    });
    await settlement.save();
    res.status(201).json(settlement);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET settlements for a group
router.get('/:groupId', auth, async (req, res) => {
  try {
    const settlements = await Settlement.find({ group: req.params.groupId })
      .populate('paidBy', 'name')
      .populate('paidTo', 'name');
    res.json(settlements);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE settlement
router.delete('/:id', auth, async (req, res) => {
  try {
    await Settlement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Settlement deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;