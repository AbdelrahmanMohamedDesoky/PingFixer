const PPPOE = require('./PPPOE');
const PingChecker = require('./PingChecker');


(async function () {
    console.log(`Checking Latency, Please Wait ...`);
    let ping = await PingChecker.getPing();
    let restart_counter = 0;
    while (!(ping.max != 'unknown' && ping.max < 70)){
        console.log(`Bad Ping Detected : ${ping.max}`);
        await PPPOE.reset_pppoe();
        restart_counter++;
        ping = await PingChecker.getPing();
    }
    console.log(`Latency is now ${ping.max} After Restarting PPPOE ${restart_counter} times`);
})();
