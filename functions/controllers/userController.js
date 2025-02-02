const userService = require('../services/userService');
const documentService = require('../services/documentService')
/*START OF userER CONTROLLER*/

// Controller for creating a new user
const createUser = async (req, res) => {
  try {
    const userId = await userService.registerUser(req.body);
    console.log('User created successfully:', userId);
    res.status(201).json({ id: userId });
  } catch (error) {
    console.error('Failed to create User', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting all users
const getAllUser = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    console.log('Fetch all user successfully:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch all User',error);
    res.status(500).json({ message: error.message });
  }
};

// Controller for getting a specific user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    console.log('Fetch user by id successfully:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch User by id',error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller for updating a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUser(id, req.body);
    console.log('User updated successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to update user', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUser(id);
    console.log('User deleted successfully:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to delete user', error.message);
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
