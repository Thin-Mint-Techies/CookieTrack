const troopService = require('../services/trooperService');

const createTrooper = async (req, res) => {
  try {
    const troopId = await troopService.createTrooper(req.body);
    console.log('Troop created successfully:', troopId);
    res.status(201).json({ id: troopId });
  } catch (error) {
    console.error('Failed to create troop',error.message);
    res.status(500).json({ message: error.message });
  }
};


const getAllTroopers = async (req, res) => {
  try {
    const troops = await troopService.getAllTroopers();
    console.log('Fetch all troop successfully:', troopId);
    res.status(200).json(troops);
  } catch (error) {
    console.error('Failed to fetch all troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTrooperById = async (req, res) => {
  const { id } = req.params;
  try {
    const troop = await troopService.getTrooperById(id);
    console.log('Get troop by id successfully:', troop);
    res.status(200).json(troop);
  } catch (error) {
    console.error('Failed to get troop by id', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateTrooper = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.updateTrooper(id, req.body);
    console.log('Troop updated successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteTrooper = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.deleteTrooper(id);
    console.log('Troop deleted successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteAllTroopers = async (req, res) => {
  try {
    const result = await troopService.deleteAllTroopers();
    console.log('All Troop deleted', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete all troop', error.message);
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  createTrooper,
  getAllTroopers,
  getTrooperById,
  updateTrooper,
  deleteTrooper,
  deleteAllTroopers,
};
