const express = require("express")
const fs = require("fs")
const app = express()

cfg = JSON.parse(fs.readFileSync("config.json", "utf8"))

const PORT = cfg.port || 80
ASPECTS = []
fs.readdirSync(".").forEach(f=>{
	if(fs.existsSync(`./${f}/aspect.js`)){
		asp = require(`./${f}/aspect.js`)
		ASPECTS.push(asp)
		console.log(`'${asp.AspectName()}' discovered`)
	}
})

const LOADED = {}

ASPECTS.forEach((f, i)=>{
	LOADED[f.AspectName()] = new f(app)
	console.log(`${f.AspectName()} :: LOADED`)
})

app.listen(PORT, f => {
	console.log(`Listening on ${PORT}`)
})