const loader = require("../src/loader.js")

express_app.all('YourRouteHere', loader.expectsAspect("AspectName"), (req, res) => {

    req.AspectName.WhateverYouWantToDoWithIt

})