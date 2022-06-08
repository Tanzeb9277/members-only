var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');

var UserScheme = new Schema(
    {
        f_name: {type: String, required: true },
        l_name: {type: String, required: true },
        username: {type:String,
            validate:{
                  validator: validator.isEmail,
                  message: '{VALUE} is not a valid email',
                  isAsync: false
                },
            required: true },
        password: { type: String, required: true },
        confirm_password: { type: String},
        is_member: { type: Boolean, default: false },
        is_admin: { type: Boolean, default: false }
    }
);

UserScheme
.virtual('name')
.get(function () {
// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case
  var fullname = '';
  if (this.f_name && this.l_name) {
    fullname = this.f_name + ' ' + this.l_name
  }
  if (!this.f_name || !this.l_name) {
    fullname = '';
  }
  return fullname;
});

//Export model
module.exports = mongoose.model('User', UserScheme);