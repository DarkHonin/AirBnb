var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./config/db');
var mongoose = require('mongoose');
var session = require('express-session');
var Booking = require('./app/models/booking')
var User = require('./app/models/user')
var Listing = require('./app/models/listing')
var engine = require('ejs-locals');

const router = express.Router()

var bcrypt = require('bcrypt');
  var loops = 10;

router.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({secret: 'mysecretphrase',
                  resave: false,
                  saveUninitialized: true
}));
router.use(function(req,res,next){
  res.locals.currentUser = req.session.user;
  next();
});

// router.engine('ejs', engine);
// router.set("view engine", "ejs");
const { parse } = require('querystring');
router.post(express.urlencoded())
router.post('/', function (req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(
                parse(body)
            );
            res.end('ok');
        });
    }
    //Listing.find({}).where('available').where('booking').equals(null).exec(function(err, listings) {
      //  res.render("index", { listings }); 
  //res.render("index", {});
//});
})

router.get("/new", function (req, res) {
  if (req.session) {
    res.render("/new", {});
  }
  else {
    res.redirect("/users/login");
  }
});

router.post("/listings", function (req, res) {
  Listing.create({name: req.body.name,
                  description: req.body.description,
                  price: req.body.price,
                  image: req.body.image,
                  available: req.body.available,
                  booking: null,
                  owner: req.session.user
                }),
    function (err, listing) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        console.log('New listing has been created');
      }
    };
  res.redirect("/listings");
});

router.get("/listings", function(req, res) {
  if (req.session.filter_date) {
    Listing.find({}).where('available').equals(req.session.filter_date).where('booking').equals(null).exec(function(err, listings) {
      res.render("listings/index", { listings });
    });
  } else {
    res.render("listings/index", { listings: null });
  }
});

router.get("/bookings/new", function(req, res) {
  if (req.session.user) {
    require('url').parse("/booking/new", true);
    Listing.findById(req.query.id, function(err, listing) {
      req.session.listing = listing;
      req.session.save();
      res.render("bookings/new", { listing })
    });
  }
  else {
    res.redirect("/users/login");
  }
});

router.post("/bookings/new", function(req, res) {
  Listing.findById(req.session.listing, function(err, currentListing) {
    Booking.create({bookingDate: currentListing.available,
                    confirmed: false,
                    rejected: false,
                    totalPrice: currentListing.price,
                    listing: currentListing,
                    listingName: currentListing.name,
                    listingOwner: currentListing.owner,
                    requester: req.session.user,
                    requesterName: req.session.user.name
                    }),
      function (err, booking) {
        if (err) {
          res.send("There was a problem adding the information to the database.");
        } else {
          console.log('New booking has been created');
        }
      };
      res.redirect("/bookings");
  });
});

router.get("/bookings", function(req, res) {
  Booking.find({'requester': req.session.user}, function(err, bookings) {
    Booking.find({}).where('requester').equals(req.session.user).exec(function(err, myBookings) {
      Booking.find({}).where('listingOwner').equals(req.session.user).exec(function(err, receivedBookings) {
          res.render("bookings/index", { myBookings, receivedBookings });
      });
    });
  });
})

router.get('/bookings/complete', function(req, res) {
  if (req.query.action === "confirm") {
    Booking.findById(req.query.booking_id, function(err, currentBooking) {
      Booking.findOneAndUpdate({ _id: currentBooking._id }, {$set: { confirmed: true } }, {new: true}, function(err, booking) {});
      Booking.find({}).where('listing').equals(currentBooking.listing).where('confirmed').equals(false).where('rejected').equals(false).exec(function(err, bookings) {
        bookings.forEach(function(booking) {
          Booking.findOneAndUpdate({ _id: booking._id }, {$set: { rejected: true } }, {new: true}, function(err, booking) {
          });
        });
        res.redirect('/bookings');
        Listing.findOneAndUpdate({ _id: currentBooking.listing }, {$set: { booking: currentBooking } }, {new: true}, function(err, listing) {});
      });
    })
  }
  else if (req.query.action === "reject") {
    Booking.findOneAndUpdate({ _id: req.query.booking_id }, {$set: { rejected: true } }, {new: true}, function(err, booking) {} );
    res.redirect('/bookings');
  }
});

router.get("/users/new", function (req, res) {
  res.render("users/new", {});
});

router.post("/users/new", function (req, res) {
  if (req.body.password === req.body.password_confirmation) {
      bcrypt.hash(req.body.password, loops, function(err, hash) {
        User.create({name:      req.body.name,
                     email:     req.body.email,
                     password:  hash            }),
        function (err, listing) {
          if (err) {
            res.send("Error adding your information");
          }
          else {
            console.log('New listing has been created');
          }
        };
        setTimeout(function() {
          User.findOne({'email': req.body.email}, function(err,user){
            req.session.user = user;
            req.session.save();
            res.redirect("/listings");
          });
        }, 500);
      });
  }
  else {
    console.log("Failed to add User");
    res.redirect("/users/new")};
});

router.get('/users/login', function(req, res){
  res.render("users/login", {});
});

router.post('/users/login', function(req, res){
  var userInput = req.body.password;
  User.findOne({'email': req.body.email}, function(err,user){
    if (user != null){
      var currentPassword = user.password;
      bcrypt.compare(userInput, currentPassword, function(err, bcryptRes) {
          if (bcryptRes == true) {
            User.findOne({'email': req.body.email}, function(err, user){
              req.session.user = user;
              req.session.save();
            });
            res.redirect("/listings");
          } else {
            res.redirect("/users/login");
          }
      });
    } else {
      res.redirect("/users/new")
    };
  });
});

router.get('/listings_filter', function(req, res){
  req.session.filter_date = req.query.filter_date;
  Listing.find({}).where('available').equals(req.session.filter_date).where('booking').equals(null).exec(function(err, listings) {
    res.render("listings/index", { listings });
  });
});

router.get('/users/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/listings');
});

router.use(function(req,res,next){
  res.status(404).send('404 Error');
});

router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('App did not load');
});

module.exports=router