// const router = express.Router();
// const express = require('express');

// const jwt = require('jsonwebtoken');
// const { key } = require('./utilities');

// function verify(req, res, next){
//     const authHeader = req.headers.tkn;

//     if(authHeader){
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, key,(err, user )=>{
//             if(err) res.status(403).json('Token is not valid!');
//             req.user=user;
//             console.log(user);
//             next();
//         });
//     }{
//         return res.status(401).json('You are not authenticated');
//     }
// }

// module.exports.verify;