const User = require('../models/user');
const bcrypt = require("bcryptjs");
const passphrase =  process.env.PASSPHRASE;
//const config = require('../config')
const { body, check, validationResult} = require('express-validator');

exports.user_create_get = function(req, res, next) {

    res.render('sign-up-form', { title: 'Sign Up'});

};
exports.user_create_post = [
  

    // Validate and sanitize fields.
    body('f_name', 'First name must not be empty.').isString(),
    body('l_name', 'Last Name must not be empty.').isString(),
    body('username', 'Username must not be empty').isEmail(),
    body('password', 'Password must not be empty').isString(),
    body('confirm_password', 'Must confirm password').isString(),

    check('password').exists(),
    check(
        'confirm_password',
        'Field must have the same value as the password field',
    )
        .exists()
        .custom((value, { req }) => value === req.body.password),

    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('sign-up-form', { title: 'Sign Up', user: req.body, errors: errors.array() });
            return;
        }else{
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if(err){
                return next(err)
            }
            const user = new User({
                f_name: req.body.f_name,
                l_name: req.body.l_name,
                username: req.body.username,
                password: hashedPassword,
                is_member: false,
                is_admin: false

              }).save(err => {
                if (err) { 
                  return next(err);
                }
                res.redirect("/");
              });
          });

        }
        
    }
];

exports.user_login_get = function(req, res, next) {

    res.render('log-in-form', { title: 'Log In'});

};

exports.user_member_get = function(req, res, next) {

    res.render('member-form');

};

exports.user_member_post = [
    check(
        'passphrase',
        'Nice Try Punk!',
    )
        .exists()
        .custom((value) => value === passphrase),
    
    
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('member-form', { title: 'Sign Up', user: req.body, errors: errors.array() });
            return;
        }else{
            User.updateOne({_id: req.body.id}, { 
                is_member: true
            }, function(err, affected, resp) {
            console.log(resp);
            },
            res.redirect("/"))
        }

}

]