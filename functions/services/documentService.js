const { storage, Firestore } = require('../firebaseConfig'); // Import Firebase config

// Create a document
async function createDoc(file, userId) {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const filePath = `users/${userId}/documents/${file.originalname}`;
    const fileRef = bucket.file(filePath);

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

    // Update the user's document field in Firestore
    const userRef = Firestore.collection('users').doc(userId);
    await userRef.update({
      documents: Firestore.FieldValue.arrayUnion({
        name: file.originalname,
        url: downloadURL,
        owner: userId,
      }),
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Fetch specific documents based on the userId
async function fetchUserDoc(userId) {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

    // List all files in the user's directory
    const [files] = await bucket.getFiles({ prefix: `users/${userId}/documents/` });

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

// Update a document's metadata or content
async function updateDoc(userId, oldFileName, newFile) {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const oldFileRef = bucket.file(`users/${userId}/documents/${oldFileName}`);
    const newFileRef = bucket.file(`users/${userId}/documents/${newFile.originalname}`);

    // Delete the old file
    await oldFileRef.delete();

    // Save the new file buffer to the bucket
    await newFileRef.save(newFile.buffer);

    // Generate an expiration date for the signed URL (1 week from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Set expiration to 7 days in the future

    // Generate a signed URL for downloading the new file
    const [downloadURL] = await newFileRef.getSignedUrl({
      action: 'read',
      expires: expirationDate,
    });

    // Update the user's document field in Firestore
    const userRef = Firestore.collection('users').doc(userId);
    await userRef.update({
      documents: Firestore.FieldValue.arrayRemove({ name: oldFileName }),
    });
    await userRef.update({
      documents: Firestore.FieldValue.arrayUnion({
        name: newFile.originalname,
        url: downloadURL,
        owner: userId,
      }),
    });

    return downloadURL;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

// Delete a document
async function deleteDoc(userId, fileName) {
  try {
    const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const fileRef = bucket.file(`users/${userId}/documents/${fileName}`);

    // Delete the file from the bucket
    await fileRef.delete();

    // Update the user's document field in Firestore
    const userRef = Firestore.collection('users').doc(userId);
    await userRef.update({
      documents: Firestore.FieldValue.arrayRemove({ name: fileName }),
    });

    return { message: 'Document deleted successfully' };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

module.exports = {
  createDoc,
  fetchUserDoc,
  updateDoc,
  deleteDoc,
};