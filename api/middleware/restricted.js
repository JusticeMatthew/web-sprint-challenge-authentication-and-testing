const { jwtSecret } = require('../../config/secret');
const jwt = require('jsonwebtoken');
const User = require('../users/model');

module.exports = {
  restricted,
  payloadChecker,
  validateUser,
};

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (error) => {
      if (error) {
        res.status(401).json('token invalid');
      } else {
        next();
      }
    });
  } else {
    res.status(401).json('token required');
  }
}

function payloadChecker(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json('username and password required');
  } else {
    next();
  }
}

function validateUser(req, res, next) {
  const { username } = req.body;
  User.getBy(username)
    .then(() => {
      res.status(400).json('username taken');
    })
    .catch(() => {
      next();
    });
}
