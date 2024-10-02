const express = require('express');
const Troop = require('../dataModels/troopModel');
const router = express.Router();


// Create a new troop
router.post('/troops', async (req, res) => {
  try {
    const id = await Troop.createTroop(req.body);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating troop', error });
  }
});

// Get all troops
router.get('/troops', async (req, res) => {
  try {
    const troops = await Troop.getTroop();
    res.status(200).json(troops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching troops', error });
  }
});

// Get a single troop by ID
router.get('/troops/:id', async (req, res) => {
  try {
    const troop = await troop.getTroopById(req.params.id);
    if (!troop) {
      return res.status(404).json({ message: 'troop not found' });
    }
    res.status(200).json(troop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching troop', error });
  }
});

// Update a troop by ID
router.put('/troops/:id', async (req, res) => {
  try {
    await Troop.updateTroop(req.params.id, req.body);
    res.status(200).json({ message: 'troop updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating troop', error });
  }
});

// Delete a troop by ID
router.delete('/troops/:id', async (req, res) => {
  try {
    await Troop.deleteTroop(req.params.id);
    res.status(200).json({ message: 'troop deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting troop', error });
  }
});

module.exports = router;
