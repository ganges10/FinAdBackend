const User = require('../models/user');
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.userById = (req, res, next, id) => {
    User.findById(id)
    .select("_id name email created")
    .exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile = user
        next()
    })
}

exports.getUser = (req,res) => {
    //console.log(res.json(req.profile))
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined
    return res.json(req.profile);
    
}

exports.updateProfile = (req,res,next) => {
    console.log(req.profile)
    console.log(req.body)
    let user = req.profile
    user = _.extend(user, req.body)
    user.updated = Date.now()
    user.save((err,result) => {
        if(err) {
                return res.status(400).json({
                error:err
            })
         }
        res.json(user) 
    })
}


