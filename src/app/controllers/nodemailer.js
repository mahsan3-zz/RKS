var mongoose = require('mongoose'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    usr = require('../models/User'),
    controller = {};

// Configure Nodemailer

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pedrobellesa@gmail.com',
        pass: 'sojhmgdrfohcfkzh'
    }
});




// post new event
controller.sendMail = [
    function(req, res, next) {
      console.log("sendMail");
        // fetch all the emails from db, comma separated list with all emails,

        usr.find({},function(err,results) {
          if(err) return next(err);
          var emailList = "";
          results.forEach(function(s){
            if(s.username) {
                emailList+=s.username + ", ";
            }
          });
          console.log(emailList);
          req.emailList = emailList;
          next();
        });

  },
  function(req, res, next) {
    console.log(req.emailList);
    transporter.sendMail({
      from: 'do-not-reply@rks.com',
      to: req.emailList,
      subject: req.body.subject,
      text: req.body.content
    });
    res.status(200).send("OK");

  }
];




module.exports = controller;
