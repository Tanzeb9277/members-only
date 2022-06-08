var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var MessageScheme = new Schema(
    {
        name: {type: String, required: true },
        message: {type: String, required: true },
        date: {type: Date, required: true}
    }
);

MessageScheme
.virtual('delete_url')
.get(function () {
  return '/message-delete/' + this._id;
});

MessageScheme
.virtual('date_formatted')
.get(function () {

  const month = this.date.getMonth()
  const year = this.date.getFullYear();
  const date = this.date.getDate();
  return months[month] + " "+ date + ", " + year;
});

//Export model
module.exports = mongoose.model('Message', MessageScheme);