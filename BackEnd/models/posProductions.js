const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise; 
const Schema = mongoose.Schema; 

const posProductionsSchema = new Schema({
    branch: { type: String,  },
    address: { type: String },
    code: { type: String },    
    city: { type: String },
    area: [{
        name: { type: String, }
      }],
});

module.exports = mongoose.model('posProductions', posProductionsSchema);