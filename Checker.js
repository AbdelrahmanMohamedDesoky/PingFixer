require('dotenv').config();
const PPPOE = require('./PPPOE');
const PingChecker = require('./PingChecker');
const YispRouter = require('./YispRouter')

async function start() {
    let restart_counter = 0;
    let ping = await PingChecker.getPing();
    console.log(`Latency is : ${ping} now !`);
    while (await isPingBad()) {
        console.log(`Bad Latency Detected : ${ping}, Please Wait`);
        // Fix Method # 1 - Rerouting Through YISP
        await processYispReroute();
        if (!await isPingBad()) break;
        // Fix Method # 2 - PPPOE Restart To change Allocated Routes/Subnets
        await processPPPOERestart();
        if (await isPingBad()) {
            restart_counter++;
        } else {
            break;
        }
    }
    ping = await PingChecker.getPing();
    console.log(`Latency for Host : ${process.env.HOST_TO_CHECK} is now ${ping} Lower than Acceptable Latency ${process.env.ACCEPTABLE_LATENCY}`);
    if (parseInt(process.env.HG630V2)) {
        console.log(`PPPOE was restarted : ${restart_counter} times`)
    }
    pressAnyKeyToContinue();
}

async function isPingBad(ping = false) {
    if (!ping) {
        ping = await PingChecker.getPing();
    }
    if (!process.env.MOCK) return true;
    return (typeof(parseInt(ping)) != 'number') || ping === 'unknown' || parseInt(ping) > parseInt(process.env.ACCEPTABLE_LATENCY);
}

function pressAnyKeyToContinue() {
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

async function processYispReroute() {
    if (parseInt(process.env.YISP_REROUTE)) {
        await YispRouter.setBestRoute();
    } else {
        console.log(`Ignoring Yisp Reroute because it is disabled in .env (YISP_REROUTE)`)
    }
}

async function processPPPOERestart() {
    if (parseInt(process.env.HG630V2)) {
        await PPPOE.reset_pppoe();
    } else {
        console.log(`Ignoring PPPOE Restart because it is disabled in .env (HG630V2)`)
    }
}


module.exports = {
    start
}