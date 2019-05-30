document.addEventListener("DOMContentLoaded", (ready) => {
    document.querySelectorAll("[data-event]").forEach(bindEvents)
})

function bindEvents(element){
    attrs = element.getAttributeNames()
    attrs.forEach(attname => {
        if(attname.startsWith("event-")){
            callback = element.getAttribute(attname)
            event = attname.split('-')[1]
            console.log(`Registering event overwride "${event}" to "${callback}"`)
            console.log(window[callback])
            element.addEventListener(event, window[callback])
        }
    })
}