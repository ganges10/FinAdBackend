const express = require('express')
const {getExpenses,addExpense,postById,updateExpense,deleteExpense,isValid} = require('../Controllers/forecast')
const { requireSignin } = require('../Controllers/auth')
const { userById } = require('../Controllers/user')

const router = express.Router();

router.get('/expense/:userId',requireSignin, getExpenses);
router.post('/expense/add/:userId',requireSignin, addExpense);
router.put('/expense/update/:postId', requireSignin, isValid, updateExpense);
router.delete('/expense/remove/:postId', requireSignin, isValid, deleteExpense);
router.param("userId", userById);
router.param("postId", postById);


module.exports = router;