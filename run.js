const express = require("express")
const fs = require("fs")
const app = express()
const loader = require("./src/loader.js")

loader.searchDir(__dirname)
loader.loadModules(app)

cfg = JSON.parse(fs.readFileSync("config.json", "utf8"))

const PORT = cfg.port || 80

app.listen(PORT, f => {
	console.log(`Listening on ${PORT}`)
})
