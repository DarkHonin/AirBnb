module.exports = class BaseAspect{
	static AspectName(){};
	AspectAuthor(){};
	AspectInfo(){ return {
		version : "0",
		description : "heck"
	}}

	constructor(baseApp){
		console.log("Aspect init triggered")

	}
}