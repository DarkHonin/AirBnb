const fs = require("fs")

global.ASPECTS = []
global.MODULES = {}

module.exports.aspects = ASPECTS
module.exports.modules = MODULES

module.exports.searchDir = (path) => {
    fs.readdirSync(path).forEach(f=>{
        if(fs.existsSync(`${path}/${f}/aspect.js`)){
            asp = require(`${path}/${f}/aspect.js`)
            ASPECTS.push(asp)
            console.log(`'${asp.AspectName()}' discovered`)
        }
    })
}

module.exports.loadModules = (app) => {
    ASPECTS.forEach((v, k) => {
        name = v.AspectName()
        global.MODULES[name] = new v(app)
        console.log(`Module init: ${v.AspectName()}`)
    })
    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            console.log(r.route.path)
        }
    })
}

module.exports.expectsAspect = (aspectName)=>{
    return (req, res, next) => {
        req[aspectName] = MODULES[aspectName]
        next()
    }
}