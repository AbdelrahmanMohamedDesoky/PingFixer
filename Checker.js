require('dotenv').config();
const PPPOE = require('./PPPOE');
const PingChecker = require('./PingChecker');
const YispRouter = require('./YispRouter')

async function start() {
    console.log(`Checking Latency !`);
    let ping = await PingChecker.getPing();
    let restart_counter = 0;
    console.log(`Latency is : ${ping}`);
    while (isPingBad(ping)) {
        console.log(`Bad Latency Detected : ${ping}, Please Wait`);
        if (parseInt(process.env.YISP_REROUTE)) {
            await YispRouter.setBestRoute();
            ping = await PingChecker.getPing();
        }
        if (!isPingBad(ping)) {
            break;
        }
        if (parseInt(process.env.HG630V2)) {
            await PPPOE.reset_pppoe();
            restart_counter++;
        }
        ping = await PingChecker.getPing();
    }
    console.log(`Latency for Host : ${process.env.HOST_TO_CHECK} is now ${ping} Lower than Acceptable Latency ${process.env.ACCEPTABLE_LATENCY}`);
    if (parseInt(process.env.HG630V2)) {
        console.log(`PPPOE was restarted : ${restart_counter} times`)
    }
}

function isPingBad(ping) {
    if (!process.env.MOCK) return true;
    return (typeof(parseInt(ping)) != 'number') || ping === 'unknown' || parseInt(ping) > parseInt(process.env.ACCEPTABLE_LATENCY);
}


module.exports = {
    start
}