var mongoose = require('mongoose');

var url = "mongodb://127.0.0.1/db" //"mongodb+srv://nceba:@the-rick@airbnb-tnbav.mongodb.net/test?retryWrites=true"
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true }, (error) => {
    if(error){
        console.log(error)
    }
})