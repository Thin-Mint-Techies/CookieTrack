const troopService = require('../services/trooperService');
/*START OF TROOPER CONTROLLER*/

// Controller for creating a new troop
const createTroop = async (req, res) => {
  try {
    const troopId = await troopService.createTroop(req.body);
    res.status(201).json({ id: troopId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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


// Controller for getting all troops
const getAllTroops = async (req, res) => {
  try {
    const troops = await troopService.getAllTroops();
    res.status(200).json(troops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a specific troop by ID
const getTroopById = async (req, res) => {
  const { id } = req.params;
  try {
    const troop = await troopService.getTroopById(id);
    res.status(200).json(troop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a troop
const updateTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.updateTroop(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a troop
const deleteTroop = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await troopService.deleteTroop(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting all troops
const deleteAllTroops = async (req, res) => {
  try {
    const result = await troopService.deleteAllTroops();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
