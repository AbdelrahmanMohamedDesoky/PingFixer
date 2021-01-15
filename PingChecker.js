const Ping = require('ping');
const BAD_PING = 999;

function getPing(){
    return Ping.promise
    .probe(process.env.HOST_TO_CHECK)
    .catch(error => 
        {
            console.error(error);
            return BAD_PING;
        }
    );
}

module.exports = {
    getPing
}