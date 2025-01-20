const documentService = require('../services/documentService')

// Upload document and image
const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.log('No file to upload' );
      return res.status(400).json({ error: 'No file to upload' });
    }

    const downloadURL = await documentService.uploadFileToStorage(file);

    
    req.file = null; // Delete the file from memory
    console.log('Upload successfully. Document URL: ', downloadURL );
    res.status(200).json({ message: 'File uploaded successfully', downloadURL: downloadURL });
  } catch (error) {
    console.log('Failed to upload document:', error.message );
    res.status(500).json({ message: error.message });

  }
};


module.exports = {
  uploadDocument,
};