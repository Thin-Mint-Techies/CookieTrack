const documentService = require('../services/documentService')

// Upload document and image
const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      console.log('No file to upload');
      return res.status(400).json({ error: 'No file to upload' });
    }

    const downloadURL = await documentService.createDoc(file, id);

    req.file = null; // Delete the file from memory
    console.log('Upload successfully. Document URL: ', downloadURL);
    res.status(200).json({ message: 'File uploaded successfully', downloadURL: downloadURL });
  } catch (error) {
    console.log('Failed to upload document:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      console.log('No file to upload');
      return res.status(400).json({ error: 'No file to upload' });
    }

    const downloadURL = await documentService.createProfilePic(file, id);

    req.file = null; // Delete the file from memory
    console.log('Upload successfully. Document URL: ', downloadURL);
    res.status(200).json({ message: 'File uploaded successfully', downloadURL: downloadURL });
  } catch (error) {
    console.log('Failed to upload document:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const uploadRewardImg = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
      console.log('No file to upload');
      return res.status(400).json({ error: 'No file to upload' });
    }

    const downloadURL = await documentService.createRewardImg(file, id);

    req.file = null; // Delete the file from memory
    console.log('Upload successfully. Document URL: ', downloadURL);
    res.status(200).json({ message: 'File uploaded successfully', downloadURL: downloadURL });
  } catch (error) {
    console.log('Failed to upload document:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    if (!fileName) {
      console.log('Filename is missing');
      return res.status(400).json({ error: 'Filename is missing' });
    }

    const result = await documentService.deleteDoc(id, fileName);
    console.log('Document deleted successfully');
    res.status(200).json(result);
  } catch (error) {
    console.log('Failed to delete document:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await documentService.deleteRewardImg(id);
    console.log('Reward deleted successfully');
    res.status(200).json(result);
  } catch (error) {
    console.log('Failed to delete reward:', error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  uploadDocument,
  uploadProfilePic,
  uploadRewardImg,
  deleteDocument,
  deleteReward,
};