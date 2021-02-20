const tcpie = require("tcpie");
const BAD_PING = 999;

function getPing() {
    const pie = tcpie(process.env.HOST_TO_CHECK, 443, {count: 10, interval: 1000, timeout: 3000});
    return new Promise(resolve => {
        let ping_results = [];
        pie.start();
        pie.on('connect', function (stats) {
            ping_results.push(stats.rtt);
        }).on('end', function (stats) {
            resolve(stats.failed > 0 ? BAD_PING : Math.max(...ping_results).toFixed(0));
        });
    });
}

module.exports = {
    getPing
}