const express = require('express');
const Expense = require('../models/Expense');
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

// ADD expense
router.post('/', auth, async (req, res) => {
  try {
    const { groupId, description, amount, splitBetween, category } = req.body;
    const expense = new Expense({
      group: groupId,
      description,
      amount,
      category: category || 'Other',
      paidBy: req.userId,
      splitBetween
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET expenses for a group
router.get('/:groupId', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name')
      .populate('splitBetween.user', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;