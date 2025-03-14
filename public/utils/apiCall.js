import { auth } from "./auth.js";
import { getIdToken } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js';

const BASE_URL = "https://api-gknady4m2q-uc.a.run.app";

export async function callApi(subroute, method = 'GET', body = null, needsAuth = true) {
  const url = `${BASE_URL}${subroute}`;
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