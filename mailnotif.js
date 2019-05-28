var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: req.session.mail,
  }
});

var mailOptions = {
  from: 'airbnb@airbnb.com',
  to: req.session.mail,
  subject: 'Airbnb Booking',
  text: req.session.user + 'has booked your listed apartment'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});