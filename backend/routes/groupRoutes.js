const express = require('express');
const Group = require('../Models/Group');
const User = require('../Models/User');
const router = express.Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find().populate('members.user', 'name');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new group
router.post('/', async (req, res) => {
  const { name, description, coverImage, members, currentBook, readingHistory, discussions, rules, privacy, maxMembers, tags, createdBy } = req.body;

  try {
    // Check if the creator is a valid user
    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(404).json({ message: 'Creator user not found' });
    }

    const group = new Group({
      name,
      description,
      coverImage,
      members: members.map(member => ({
        user: member.user,
        role: member.role || 'member',
        joinedAt: member.joinedAt || new Date()
      })),
      currentBook,
      readingHistory,
      discussions,
      rules,
      privacy,
      maxMembers,
      tags,
      createdBy
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Quit a group
router.delete('/:id/members/:userId', async (req, res) => {
  const { id, userId } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const member = group.members.find(m => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ message: 'User is not a member of this group' });
    }

    group.members = group.members.filter(m => m.user.toString() !== userId);
    await group.save();
    res.json({ message: 'User has quit the group' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;