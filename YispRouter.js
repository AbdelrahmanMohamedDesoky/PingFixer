const querystring = require('querystring');
const axios = require('axios');
const PingChecker = require('./PingChecker');
const delay = require('delay');
const axiosRetry = require('axios-retry');
axiosRetry(axios, { retries: 5 , retryDelay: axiosRetry.exponentialDelay});

async function setBestRoute() {
    console.log(`Attempting to lower latency by selecting best route to VPN`);
    let routes_available = ['level3', 'cogent', 'sparkle', 'tata', 'telia'];
    let bestRoute = 'default';
    await setRoute(bestRoute);
    let best_route_ping = await PingChecker.getPing();
    let current_route_ping;
    console.log(`Route : default, Latency : ${best_route_ping}`);
    for (let currentRoute of routes_available) {
        await setRoute(currentRoute);
        current_route_ping = await PingChecker.getPing();
        console.log(`Route : ${currentRoute}, Latency : ${current_route_ping}`);
        if (typeof parseInt(current_route_ping) == 'number' && parseInt(current_route_ping) < parseInt(best_route_ping)){
            bestRoute = currentRoute;
            best_route_ping = current_route_ping
        }
    }
    console.log(`Setting Best Route For Yisp Server : ${bestRoute}`);
    await setRoute(bestRoute);
    return new Promise(resolve => resolve(true));
}

function setRoute(route) {
    return new Promise(resolve => {
        axios.post('http://lg.yisp.nl/update.php', querystring.stringify({ option: route }))
            .then(async () => {
                await delay(3000);
                resolve(true);
            })
            .catch(async (error) => {
                console.log(error);
                await delay(3000);
                resolve(true);
            });
    });
}


module.exports = {
    setBestRoute
}