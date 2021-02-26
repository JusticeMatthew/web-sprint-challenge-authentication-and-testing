const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../../config/secret');
const jwt = require('jsonwebtoken');

const User = require('../users/model');
const { payloadChecker, validateUser } = require('../middleware/restricted');

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, jwtSecret, options);
}

router.post('/register', payloadChecker, validateUser, async (req, res) => {
  const credentials = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 10;
  const hash = bcrypt.hashSync(credentials.password, rounds);
  credentials.password = hash;
  const newUser = await User.add(credentials);
  res.status(201).json(newUser);
});

router.post('/login', payloadChecker, async (req, res) => {
  const { username, password } = req.body;
  const tryUser = await User.getBy({ username: username }).first();

  if (tryUser && bcrypt.compareSync(password, tryUser.password)) {
    const token = generateToken(tryUser);
    res
      .status(200)
      .json({ message: `Welcome Back ${tryUser.username}`, token });
  } else {
    res.status(401).json('invalid credentials');
  }
});

module.exports = router;
