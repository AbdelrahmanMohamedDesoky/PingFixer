const puppeteer = require('puppeteer');
const delay = require('delay');
let interval_id;
function reset_pppoe(){
    return new Promise(async resolve => {
        const puppeteer_options = {
            headless: true,
            ignoreHTTPSErrors: true,
        };
        appendToConsole('Attempting To Change IP Because your IP is fucked ');
        interval_id =  setInterval(() => {
            appendToConsole('.');
        }, 1000);
        const browser = await puppeteer.launch(puppeteer_options);
        const page = await browser.newPage();
        await page.goto(process.env.ROUTER_URL, {});

        // Login
        await page.type('#index_username', process.env.ROUTER_USERNAME);
        await page.type('#password', process.env.ROUTER_PASSWORD);
        await page.click('#loginbtn');
        await page.waitForNavigation();

        // Navigate To Internet Tab
        await page.waitForSelector('#internet_settings_menu');
        await page.click('#internet_settings_menu');

        // Reset PPPOE
        await page.waitForSelector("#wan_setup_InternetGatewayDevice_WANDevice_2_WANConnectionDevice_1_WANPPPConnection_1__reset");
        await page.click('#wan_setup_InternetGatewayDevice_WANDevice_2_WANConnectionDevice_1_WANPPPConnection_1__reset');

        // Done Close Browser
        await browser.close();

        // Waiting For New IP
        await delay(15000);
        clearInterval(interval_id);
        appendToConsole(' Done ! - Testing New IP', true);
        resolve(true);
    });
}

function appendToConsole(text, new_line = false) {
    process.stdout.write(text);
    if (new_line) process.stdout.write("\n");
}

module.exports = {
    reset_pppoe
}