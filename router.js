var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./config/db');
var mongoose = require('mongoose');
var session = require('express-session');
var Booking = require('./app/models/booking')
var Listing = require('./app/models/listing')
var engine = require('ejs-locals');

const router = express.Router()

router.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({secret: 'mysecretphrase',
                  resave: false,
                  saveUninitialized: true
}));

const parser = (req, res, next) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on("end", () => {
      req['json'] = JSON.parse(body)
      next()
    })
}
}

router.post("/", parser)
router.post('/', function (req, res) {
  console.log(req.json)
  query = Listing.find({}).where('available').where('booking')
  if (req.json["price_max"])
    query = query.where("price").lt(req.json["price_max"])
  query = query.equals(null)
  query.exec(function(err, listings) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(listings));
  //res.render("index", {});
  });
})

router.get("/new", function (req, res) {
  if (req.session) {
    res.render("/new", {});
  }
  else {
    res.redirect("/users/login");
  }
});

router.post("/listings", (req, res) => {
                                          Listing.create({
                                            name: req.body.name,
                                            description: req.body.description,
                                            price: req.body.price,
                                            image: req.body.image,
                                            available: req.body.available,
                                            booking: null,
                                            owner: req.session.user
                                          }
                                        ),
    function (err, listing) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      }
      else {
        console.log('New listing has been created');
      }
      res.json(listing)
    };
  // res.redirect("/listings");
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

router.post("/bookings/new", function(req, res) {
  if (req.json['test_booking']) {
    require('url').parse("/booking/new", true);
    Listing.findById(req.query.id, function(err, listing) {
      req.session.listing = listing;
      req.session.save();
      res.json("bookings/new", { listing })
    });
  }
});

router.post("/bookings/new", function(req, res) {
  Listing.findById(req.session.listing, function(err, currentListing) {
    Booking.create({bookingDate: currentListing.available,
                    availableDate: currentListing.available,
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
        Listing.findOneAndUpdate({ _id: currentBooking.listing }, {$set: { booking: currentBooking } }, {new: true}, function(err, listing) {
          if(err){
            res.send(err)
          }
          res.json(listing)
        });
      });
    })
  }
  else if (req.query.action === "reject") {
    Booking.findOneAndUpdate({ _id: req.query.booking_id }, {$set: { rejected: true } }, {new: true}, function(err, booking) {
      if(err){
        res.send(err)
      }
      res.json(booking)
    } );
    // res.redirect('/bookings');
  }
});


router.post('/listing_filter', (req, res) => {
  req.session.filter_date = req.query.filter_date
  Listing.find({}).where('available').equals(req.session.filter_date).where('booking').equals(null).exec(function(err, filtered_list){
    if(err){
      res.send(err)
    }
    res.json(filtered_list)
  })
})


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