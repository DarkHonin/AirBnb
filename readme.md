# AirBnB Base Framework
## Usage

Every aspect requires a file named `aspect.js` that exports an instanse of `BaseAspect`

	const base = require("../src/base_aspect.js")

	module.exports = class TestAspect extends base{
		static AspectName(){return "TestAspect"};
		AspectAuthor(){return "wgourley"};
		AspectInfo() {return {
			version : "0",
			description : "A test aspect"
		}}

		constructor(base){
			super(base)
		}

	}

This will be the entry point for the module
