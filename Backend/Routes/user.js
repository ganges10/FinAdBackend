const express = require('express')
const { updateProfile,userById} = require('../Controllers/user')
const { requireSignin } = require('../Controllers/auth')

const router = express.Router();
router.put('/user/:userId', requireSignin, updateProfile);
router.param("userId", userById);
module.exports = router;