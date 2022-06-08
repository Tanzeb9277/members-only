const Message = require('../models/message');
const { body, check, validationResult} = require('express-validator');

exports.index = function(req, res) {

    Message.find({}, 'date name message')
      .sort({date : -1})
      .populate('name')
      .populate('message')
      .exec(function (err, list_messages) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { message_list: list_messages });
      });
};

exports.message_create_get = function(req, res, next) {

    res.render('message-form');

};

exports.message_create_post = [
  

    // Validate and sanitize fields.
    body('name', 'Must be logged in').isString(),
    body('message', 'Message must not be empty.').isString(),


    // Process request after validation and sanitization.
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('message-form', { user: req.body, errors: errors.array() });
            return;
        }else{
            const message = new Message({
                name: req.body.name,
                message: req.body.message,
                date: new Date()
              }).save(err => {
                if (err) { 
                  return next(err);
                }
                res.redirect("/");
              });

        }
        
    }
];

exports.message_delete_post = function(req, res, next) {
    
  // Assume valid BookInstance id in field.
  Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
      if (err) { return next(err); }
      // Success, so redirect to list of BookInstance items.
      res.redirect('/');
      });

};