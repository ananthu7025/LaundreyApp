
// controllers/user.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { roles } = require('../enum');

exports.signup = async (req, res) => {
  try {
    const { username, email, password, phone, role, location } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: role || roles.USER, 
      location:location
    });
    const responce = new User({
      username,
      email,
      phone,
      role: role || roles.USER, 
      location:location
    });
    
    await newUser.save();

    // Generate an access token
    const accessToken = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '9h' });

    res.status(201).json({ message: 'Signup successful.', accessToken,responce });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while registering user.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '9h' });

    // Respond with user details without password
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ message: 'Login successful.', accessToken, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};



exports.getUserDetailsByToken = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required.' });
    }

    const decodedToken = jwt.verify(accessToken, 'your-secret-key');
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Respond with user details without password
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching user details.' });
  }
};
