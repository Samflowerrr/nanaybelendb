const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    company: 'online', uri: 'mongodb+srv://samanthaandreaguadalquiver:Samantha08@cluster0.atmibzo.mongodb.net/nb', secret: crypto,  db: 'nb',  port : process.env.PORT || 8080,
   //company: 'offline', uri: 'mongodb://localhost:27017/nb?readPreference=primary&appname=MongoDB%20Compass&ssl=false', secret: crypto,  db: 'nb',  port : process.env.PORT || 8080,
}