const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all Users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users) return res.status(400).json({ message: 'No users Found' });
  res.json(users);
});

// @desc Create new User
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm Data
  if (!username || !password || !Array.isArray(roles) || !roles.length)
    return res.status(400).json({ message: 'All fields are required' });

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) return res.status(409).json({ message: 'Duplicate username' });

  // Hash the password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { username, password: hashedPwd, roles };

  // Create and store new user
  const user = await User.create(userObject);
  user
    ? res.status(201).json({ message: `New user ${username} created` })
    : res.status(400).json({ message: 'Invalid user data received' });
});

// @desc Update a User
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  )
    return res.status(400).json({ message: 'All fields are required' });

  const user = await User.findById(id).exec();

  if (!user) return res.status(400).json({ message: `User not found` });

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(409).json({ message: `Duplicate username` });

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password)
    // hash pwd
    user.password = await bcrypt.hash(password, 10); //salt rounds

  const updatedUser = await User.saved();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a User
// @route PATCH /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) res.status(400).json({ message: `User ID required` });

  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes?.length)
    return res.status(400).json({ message: `User has assigned notes` });

  const user = await User.findById(id).exec();

  if (!user) return res.status(400).json({ message: `User not found` });

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id}`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
