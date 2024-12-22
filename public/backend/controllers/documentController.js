const documentService = require('../services/documentService')

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
  uploadDocument,
};