const { storage } = require('../config/firebaseConfig'); // Import Firebase config


//TODO: Create a folder based on user id, create a folder call documents inside this folder, 
// then push the file into it, return the Url or name 
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

// fetch specific documents based on the userId and document name

// delete specific documents based on userId and document name

async function fetchUserDocuments(userId){
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

    // List all files in the user's directory
    const [files] = await bucket.getFiles({ prefix: `users/${userId}/` });

    // Check if there are any files
    if (!files.length) {
      console.log(`No files found for user ID: ${userId}`);
      return [];
    }

    // Generate signed URLs for each file
    const userFiles = await Promise.all(
      files.map(async (file) => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return { name: file.name, url };
      })
    );

    console.log(`Fetched ${userFiles.length} files for user ID: ${userId}`);
    return userFiles;
  } catch (error) {
    console.error('Error fetching user files:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToStorage,
  fetchUserDocuments,
};
