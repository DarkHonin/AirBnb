# AirBnB Base Framework
## Usage

An aspect is described by the `BaseAspect` class in `src/base_aspect.js`

For an aspect to work efficiently if will need to export a class extending `BaseAspect` from the file `aspect.js`

	const base = require("../src/base_aspect.js")

	module.exports = class TestAspect extends base{
		static AspectName(){return "TestAspect"};
		AspectAuthor(){return "wgourley"};
		AspectInfo() {return {
			version : "0",
			description : "A test aspect"
		}}

		constructor(express_app){
			super(express_app)
		}
	}

In adition to the aspect loader there is a `middleware` asect that can be used to pass aspects to routes

	const loader = require("../src/loader.js")

	express_app.all('YourRouteHere', loader.expectsAspect("AspectName"), (req, res) => {

        req.AspectName.WhateverYouWantToDoWithIt

    })

