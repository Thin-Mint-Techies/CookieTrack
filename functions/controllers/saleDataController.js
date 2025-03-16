const { get } = require('../routes/saleDataRoute');
const saleDataService = require('../services/saleDataService');

const createSaleData = async (req, res) => {
  try {
    const saleDataId = await saleDataService.createSaleData(req.body);
    console.log('saleData created successfully:', saleDataId);
    res.status(201).json({ id: saleDataId });
  } catch (error) {
    console.error('Failed to create saleData:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getSaleData = async (req, res) => {
  const { id } = req.params;
  try {
    const saleDatas = await saleDataService.getSaleData(id);
    console.log('saleData fetch successfully:', saleDatas);
    res.status(200).json(saleDatas);
  } catch (error) {
    console.error('Failed to fetch saleDatas by id: ', error.message)
    res.status(500).json({ message: error.message });
  }
};


const updatesaleData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await saleDataService.updateSaleData(id, req.body);
    console.log('saleData updated successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update saleData',error.message);
    res.status(500).json({ message: error.message });
  }
};

const deletesaleData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await saleDataService.deleteSaleData(id);
    console.log('saleData deleted successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete saleData',error.message)
    res.status(500).json({ message: error.message });
  }
};

const getSaleDatasByTrooperId = async (req, res) => {
  try {
    const saleDatas = await saleDataService.getSaleDatasByTrooperId();
    console.log('saleData fetch by trooperId successfully:', saleDatas);
    res.status(200).json(saleDatas);
  } catch (error) {
    console.error('Failed to fetch saleData by trooperId saleDatas: ', error.message)
    res.status(500).json({ message: error.message });
  }
};

const getSaleDataByOwnerId = async (req, res) => {
  try {
    const saleDatas = await saleDataService.getSaleDataByOwnerId();
    console.log('saleData fetch by ownerId successfully:', saleDatas);
    res.status(200).json(saleDatas);
  } catch (error) {
    console.error('Failed to fetch saleDatas by ownerId: ', error.message)
    res.status(500).json({ message: error.message });
  }
};

const getAllSaleData = async (req, res) => {
  try {
    const saleDatas = await saleDataService.getAllSaleData();
    console.log('saleData fetch successfully:', saleDatas);
    res.status(200).json(saleDatas);
  } catch (error) {
    console.error('Failed to fetch all saleDatas: ', error.message)
    res.status(500).json({ message: error.message });
  }
};
// Controller for deleting all saleDatas
/*
const deleteAllsaleData = async (req, res) => {
  try {
    const result = await saleDataService.deleteAllsaleData();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/





module.exports = {
  createSaleData,
  //updatesaleData,
  getSaleData,
  deletesaleData,
  
  getSaleDatasByTrooperId,
  getSaleDataByOwnerId,
  getAllSaleData
};
