const Expenditure = require('../models/forecast')
const _ = require('lodash')

exports.postById = (req,res,next,id) => {
    Expenditure.findById(id)
    .populate("user","_id name")
    .select("_id income expenditure user created")
    .exec((err,post) => {
        if(err || !post) {
            return res.status(400).json({
                error: err
            })
        }
        req.post = post
        next()
    })
}

exports.addExpense = (req,res,next) => {
    console.log(req.profile)
    let exp = new Expenditure(req.body);
    exp.user = req.profile._id;
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    exp.save((err,result)=>{
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(result)
    })
};

exports.getExpenses = (req,res) => {
    Expenditure.find({user: req.profile._id})
        .populate("user","_id name")
        .select("_id income expenditure created")
        .sort("_created")
        .exec((err,posts) =>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(posts)
        })
};

exports.isValid = (req,res,next) => {
    let isPoster = req.post && req.auth && req.post.user._id == req.auth._id
    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next();
};


exports.updateExpense = (req,res,next) => {
    console.log(req.body)
    let post = req.post
    post = _.extend(post, req.body)
    post.updated = Date.now()
    post.save((err,result) => {
        if(err) {
                return res.status(400).json({
                error:err
            })
         }
        res.json(post) 
    })
}

exports.deleteExpense = (req,res) => {
    let exp= req.post
    exp.remove((err,post)=> {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: "Message deleted successfully"
        })
    })
};

