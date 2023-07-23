const express = require('express')
const router = express.Router()

const { createAccount, loginUser, getAccount, updateAccount} = require('../controllers/account_controller');


const authMiddleware = require('../middlewares/authentication')


router.route('/').post(createAccount);
router.route('/').get(getAccount);
router.route('/login').post(loginUser);
router.route('/').patch(updateAccount)
module.exports = router