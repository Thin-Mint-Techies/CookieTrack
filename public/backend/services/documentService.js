const { storage } = require('../config/firebaseConfig'); // Import Firebase config

async function uploadFileToStorage(file) {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const fileRef = bucket.file(file.originalname);

    // Save the file buffer to the bucket
    await fileRef.save(file.buffer);

    // Generate an expiration date for the signed URL (1 week from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration to 7 days in the future

    // Generate a signed URL for downloading the file
    const [downloadURL] = await fileRef.getSignedUrl({
      action: 'read',
      expires: expirationDate,
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToStorage,
};
