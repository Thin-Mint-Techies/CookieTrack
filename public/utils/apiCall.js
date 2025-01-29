const BASE_URL = "https://api-gknady4m2q-uc.a.run.app";

export async function callApi(subroute, method = 'GET', body = null) {
  const url = `${BASE_URL}${subroute}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Error calling the API:', error);
  }
}