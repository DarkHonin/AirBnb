const framework = require("./framework/run.js")
const express = require("express")
const fs = require("fs")
const app = express()

framework.searchDir(__dirname)
framework.loadModules(app)
global.app_root = __dirname
const PORT = 80

app.listen(PORT, f => {
	console.log(`Listening on ${PORT}`)
})