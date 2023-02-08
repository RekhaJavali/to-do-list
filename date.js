
// console.log(module);
/*shortcut remove module
chnage module.exports.getDate = getDate;
 let getDate =function(){*/


module.exports.getDate = function(){
    const day = new Date();  
    const options = { weekday: 'long', month: 'short', day: 'numeric'};

    return  day.toLocaleDateString("en-US", options);
    // return theday;
}

module.exports.getDay = function (){
    const day = new Date();  
    const options = { weekday: 'long'};

    const theday = day.toLocaleDateString("en-US", options);
    return theday;
}
console.log(module.exports);