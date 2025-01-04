const cookieService = require('../services/cookieService');
/*START OF CookieER CONTROLLER*/

// Controller for creating a new Cookie
const createCookie = async (req, res) => {
  try {
    const CookieId = await cookieService.createCookie(req.body);
    res.status(201).json({ id: CookieId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all Cookies
const getAllCookie = async (req, res) => {
  try {
    const Cookies = await cookieService.getAllCookies();
    res.status(200).json(Cookies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Controller for updating a Cookie
const updateCookie = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cookieService.updateCookie(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a Cookie
const deleteCookie = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cookieService.deleteCookie(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyCookies = async (req, res) => {
  try {
    const Cookies = await cookieService.getMonthlyCookies();
    res.status(200).json(Cookies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCookieManager = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: Missing ID token' });
  }

  try {
    const Cookies = await cookieService.createCookieManager(idToken, req.body);
    res.status(200).json(Cookies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting all Cookies
/*
const deleteAllCookie = async (req, res) => {
  try {
    const result = await CookieService.deleteAllCookie();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/




module.exports = {
  createCookie,
  getAllCookie,
  updateCookie,
  deleteCookie,
  getMonthlyCookies,
  createCookieManager
};
