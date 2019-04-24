const express = require('express');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/setuppaspot');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const {OAuth2Client} = require('google-auth-library');


const app = express();

// set up view  engine
app.set('view engine','ejs');

//verify the IdToken
async function verify(id) {
const client = new OAuth2Client("105762379829-25enp505bh53ulbrdrpoelfqauub5uc0.apps.googleusercontent.com");
  const ticket = await client.verifyIdToken({
      idToken: id,
      audience: "105762379829-25enp505bh53ulbrdrpoelfqauub5uc0.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(payload)
}



// connect to mongodb
mongoose.connect("105762379829-25enp505bh53ulbrdrpoelfqauub5uc0.apps.googleusercontent.com",() =>{
    console.log('connected to mongodb');
});

//set up routes
app.use('/auth', authRoutes);

//create home route
app.get('/',(req, res) => {
    res.render('home');
});

app.post("/test", (req, res) => {
    var body = ""
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on("end", () => {
        q = JSON.parse(body)
        verify(q.token_id)
    })
    //verify().catch(console.error);
})

app.listen(3000,() =>{
    console.log('listen for the request on port 3000');
})