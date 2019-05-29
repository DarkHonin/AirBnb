module.exports = class BaseAspect{
	static AspectName(){};
	static AspectAuthor(){};
	static AspectInfo(){ return {
		version : "0",
		description : "heck"
	}}

	constructor(baseApp){
		console.log("Aspect init triggered")
	}

	register_routes(baseApp){}
}