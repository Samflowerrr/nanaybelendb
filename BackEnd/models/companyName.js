const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const companyNameSchema = new Schema({
    name: { type: String },
    tagline: { type: String },
    thumbnail: { type: String },
    wallpaper: { type: String },
    about: { type: String },
});

module.exports = mongoose.model('CompanyName', companyNameSchema);