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
    for(var k in MODULES){
        aspect = MODULES[k]
        aspect.register_routes(app)
        console.log(`Routes init: ${k}`)
    }
}

module.exports.expectsAspect = (aspectName)=>{
    return (req, res, next) => {
        req[aspectName] = MODULES[aspectName]
        next()
    }
}