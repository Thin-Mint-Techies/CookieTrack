const troopService = require('../services/trooperService');

const createTroop = async (req, res) => {
  try {
    const troopId = await troopService.createTroop(req.body);
    console.log('Troop created successfully:', troopId);
    res.status(201).json({ id: troopId });
  } catch (error) {
    console.error('Failed to create troop',error.message);
    res.status(500).json({ message: error.message });
  }
};


const getAllTroops = async (req, res) => {
  try {
    const troops = await troopService.getAllTroops();
    console.log('Fetch all troop successfully:', troopId);
    res.status(200).json(troops);
  } catch (error) {
    console.error('Failed to fetch all troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTroopById = async (req, res) => {
  const { id } = req.params;
  try {
    const troop = await troopService.getTroopById(id);
    console.log('Get troop by id successfully:', troop);
    res.status(200).json(troop);
  } catch (error) {
    console.error('Failed to get troop by id', error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.updateTroop(id, req.body);
    console.log('Troop updated successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.deleteTroop(id);
    console.log('Troop deleted successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete troop', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteAllTroops = async (req, res) => {
  try {
    const result = await troopService.deleteAllTroops();
    console.log('All Troop deleted', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete all troop', error.message);
    res.status(500).json({ message: error.message });
  }
};


//need more testing, need to go through roleCheck.js first
const createTroop2Controller = async (req, res) => {
  try {
    // Extract troop data from the request body
    const { name, email, assignedParent } = req.body;

    // Extract the user ID from the authenticated request
    //const userId = req.user.uid;

    // Call the service to create the troop
    const result = await troopService.createTroop2({ name, email, assignedParent});
    //,userId

    // Send success response
    res.status(201).json({ success: true, message: 'Troop created successfully', troopId: result.troopId });
  } catch (error) {
    // Handle errors and send response to the client
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = {
  createTroop,
  createTroop2Controller,
  getAllTroops,
  getTroopById,
  updateTroop,
  deleteTroop,
  deleteAllTroops,
};
