var mongoose = require('mongoose');

<<<<<<< HEAD
var url = "mongodb://127.0.0.1/db" //"mongodb+srv://nceba:@the-rick@airbnb-tnbav.mongodb.net/test?retryWrites=true"
=======
var url = "mongodb://127.0.0.1:27017/db"//"mongodb+srv://nceba:the-rick@airbnb-tnbav.mongodb.net/test?retryWrites=true"
>>>>>>> 850ec69224295b27fb5dd2b178279da01def5e26
mongoose.set('useCreateIndex', true)
mongoose.connect(url, { useNewUrlParser: true }, (error) => {
    if(error){
        console.log(error)
    }
})