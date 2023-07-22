const mongoose = require('mongoose')

const connectDatabase = (urlString)=>{
    return mongoose.connect(urlString);
}


module.exports = connectDatabase