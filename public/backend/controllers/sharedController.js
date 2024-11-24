const troopService = require('../services/troopService');
const documentService = require('../services/documentService')
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

/*START OF DOCUMENTS CONTROLLER */
// Upload document (with image)
const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const downloadURL = await documentService.uploadFileToStorage(file);

    // Delete the file from memory
    req.file = null;

    res.status(200).json({ message: 'File uploaded successfully', downloadURL: downloadURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};


module.exports = {
  createTroop,
  getAllTroops,
  getTroopById,
  updateTroop,
  deleteTroop,
  deleteAllTroops,
  uploadDocument,
};
