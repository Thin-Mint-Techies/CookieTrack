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
  try {
    const saleDatas = await saleDataService.getSaleData();
    console.log('saleData fetch successfully:', saleDatas);
    res.status(200).json(saleDatas);
  } catch (error) {
    console.error('Failed to fetch all saleDatas: ', error.message)
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
  updatesaleData,
  getSaleData,
  deletesaleData
};
