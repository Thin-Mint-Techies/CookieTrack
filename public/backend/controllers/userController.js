const userService = require('../services/userService');
const documentService = require('../services/documentService')
/*START OF userER CONTROLLER*/

// Controller for creating a new user
const createUser = async (req, res) => {
  try {
    const userId = await userService.createUser(req.body);
    res.status(201).json({ id: userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all users
const getAllUser = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a specific user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUser(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting all users
/*
const deleteAllUser = async (req, res) => {
  try {
    const result = await userService.deleteAllUser();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/




module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
