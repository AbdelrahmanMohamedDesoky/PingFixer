const Ping = require('ping');
const BAD_PING = 999;

function getPing(){
    return Ping.promise.probe('www.egyptsolution.com').catch(error => {
        console.error(error);
        return BAD_PING;
    });
}

module.exports = {
    getPing
}