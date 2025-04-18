import { auth } from "./auth.js";
import { getIdToken } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';

const PROD_URL = "https://api-gknady4m2q-uc.a.run.app";
const TEST_URL = "http://localhost:5000";
const MAIN_URL = TEST_URL;

export async function callApi(subroute, method = 'GET', body = null, needsAuth = true) {
  const url = `${MAIN_URL}${subroute}`;
  const userToken = await getIdToken(auth.currentUser);

  const options = {
    method,
    ...(needsAuth ? {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      }
    } : null),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();;
  } catch (error) {
    console.error('Error calling the API:', error);
  }
}

export function uploadDocumentXHR(subroute, file, onProgress = null) {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    // Add the file to the FormData object
    formData.append('file', file);
    
    // Set up the request
    xhr.open('POST', `${MAIN_URL}${subroute}`);
    
    // Get and add the authentication token
    try {
      const userToken = await getIdToken(auth.currentUser);
      xhr.setRequestHeader('Authorization', `Bearer ${userToken}`);
    } catch (error) {
      reject(new Error('Failed to get authentication token: ' + error.message));
      return;
    }
    
    // Set up progress tracking if a callback is provided
    if (onProgress && typeof onProgress === 'function') {
      xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };
    }
    
    // Handle successful completion
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid JSON response: ' + xhr.responseText));
        }
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}, message: ${xhr.responseText}`));
      }
    };
    
    // Handle network errors
    xhr.onerror = function() {
      reject(new Error('Network error occurred'));
    };
    
    // Handle timeouts
    xhr.ontimeout = function() {
      reject(new Error('Request timed out'));
    };
    
    // Send the request with the FormData
    xhr.send(formData);
  });
}