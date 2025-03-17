const inventoryService = require('../services/inventoryService');
/*START OF Inventory CONTROLLER*/


const createParentInventory = async (req, res) => {
    try {
      const inventoryId = await inventoryService.createParentInventory(req.body);
      console.log('Inventory created successfully:', { id: inventoryId });
      res.status(201).json({ message: 'Inventory created successfully', inventoryId });
    } catch (error) {
      console.error('Failed to create Inventory:', error.message);
      res.status(500).json({ message: error.message });
    }
  };

const updateParentInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await inventoryService.updateParentInventory(id, req.body);
    console.log("Update Inventory successfully", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update Inventory', error.message);
    res.status(500).json({ message: error.message });
  }
};

const createLeaderInventory = async (req, res) => {
    try {
      const inventoryId = await inventoryService.createLeaderInventory(req.body);
      console.log('Inventory created successfully:', { id: inventoryId });
      res.status(201).json({ message: 'Inventory created successfully', inventoryId });
    } catch (error) {
      console.error('Failed to create Inventory:', error.message);
      res.status(500).json({ message: error.message });
    }
  };

const updateLeaderInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await inventoryService.updateLeaderInventory(id, req.body);
    console.log("Update Inventory successfully", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update Inventory', error.message);
    res.status(500).json({ message: error.message });
  }
};


const getAllInventories = async (req, res) => {
  try {
    const inventories = await inventoryService.getAllInventories();
    console.log("Fetch all Inventorys successfully", inventories);
    res.status(200).json(inventories);
  } catch (error) {
    console.error('Failed to fetch all Inventories', error.message);
    res.status(500).json({ message: error.message });
  }
};



const deleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await inventoryService.deleteInventory(id);
    console.log("Delete Inventory successfully", result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete Inventory', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getInventoryByOwnerId = async (req, res) => {
  const {id} = req.params
  try {
    const inventories = await inventoryService.getInventoryByOwnerId(id);
    console.log("Fetch user inventory successfully", inventories);
    res.status(200).json(inventories);
  } catch (error) {
    console.error('Failed to fetch user inventory Inventory', error.message);
    res.status(500).json({ message: error.message });
  }
};






module.exports = {
  createParentInventory,
  updateParentInventory,
  createLeaderInventory,
  updateLeaderInventory,
  getAllInventories,
  deleteInventory,
  getInventoryByOwnerId
};
