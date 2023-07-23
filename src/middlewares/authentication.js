const jwt = require('jsonwebtoken')
// const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId, email: payload.email }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
};