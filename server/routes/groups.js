const express = require('express');
const Group = require('../models/Group');
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

// CREATE a group
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const group = new Group({
      name,
      createdBy: req.userId,
      members: [req.userId]
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all groups for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.userId });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADD member to group
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const group = await Group.findById(req.params.id);
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    group.members.push(user._id);
    await group.save();
    res.json({ message: 'Member added', group });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET balances for a group
router.get('/:id/balances', auth, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    const Settlement = require('../models/Settlement');

    const expenses = await Expense.find({ group: req.params.id })
      .populate('paidBy', 'name')
      .populate('splitBetween.user', 'name');

    const settlements = await Settlement.find({ group: req.params.id })
      .populate('paidBy', 'name')
      .populate('paidTo', 'name');

    const balances = {};

    // Process expenses
    expenses.forEach((expense) => {
      const payerId = expense.paidBy._id.toString();
      const payerName = expense.paidBy.name;

      if (!balances[payerId]) balances[payerId] = { name: payerName, amount: 0 };
      balances[payerId].amount += expense.amount;

      expense.splitBetween.forEach((split) => {
        const userId = split.user._id.toString();
        const userName = split.user.name;
        if (!balances[userId]) balances[userId] = { name: userName, amount: 0 };
        balances[userId].amount -= split.share;
      });
    });

    // Process settlements
    settlements.forEach((settlement) => {
      const paidById = settlement.paidBy._id.toString();
      const paidToId = settlement.paidTo._id.toString();

      if (!balances[paidById]) balances[paidById] = { name: settlement.paidBy.name, amount: 0 };
      if (!balances[paidToId]) balances[paidToId] = { name: settlement.paidTo.name, amount: 0 };

      balances[paidById].amount += settlement.amount;
      balances[paidToId].amount -= settlement.amount;
    });

    const result = Object.entries(balances).map(([id, data]) => ({
      userId: id,
      name: data.name,
      balance: parseFloat(data.amount.toFixed(2))
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;