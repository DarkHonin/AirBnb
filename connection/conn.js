const express = require('express');
const mongoose = require('mongoose');

const app = express();


mongoose.connect('mongodb+srv://allie:Moknare95@airbnb-ttiyl.mongodb.net/test?retryWrites=true', () => {
    console.log('connected to mongodb');
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});