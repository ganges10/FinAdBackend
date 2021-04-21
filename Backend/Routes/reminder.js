const express = require('express')
const {getReminder,addReminder,remById,updateReminder,deleteReminder,isValid} = require('../Controllers/reminder')
const { requireSignin } = require('../Controllers/auth')
const { userById } = require('../Controllers/user')

const router = express.Router();

router.get('/reminder/:userId',requireSignin, getReminder);
router.post('/reminder/add/:userId',requireSignin, addReminder);
router.put('/reminder/update/:postId', requireSignin, isValid, updateReminder);
router.delete('/reminder/remove/:postId', requireSignin, isValid, deleteReminder);
router.param("userId", userById);
router.param("postId", remById);


module.exports = router;