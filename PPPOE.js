const puppeteer = require('puppeteer');
const delay = require('delay');

function reset_pppoe(){
    return new Promise(async resolve => {
        const puppeteer_options = {
            headless: true,
            ignoreHTTPSErrors: true,
        };
        const browser = await puppeteer.launch(puppeteer_options);
        const page = await browser.newPage();
        await page.goto('https://192.168.2.1');

        // Login
        await page.type('#index_username', 'admin');
        await page.type('#password', 'kaymera50505050');
        await page.click('#loginbtn');
        await page.waitForNavigation();

        // Navigate To Internet Tab
        await page.waitForSelector('#internet_settings_menu');
        await page.click('#internet_settings_menu');


        // Reset PPPOEE
        await page.waitForSelector("#wan_setup_InternetGatewayDevice_WANDevice_2_WANConnectionDevice_1_WANPPPConnection_1__reset");
        console.log("Restarting PPPOE Now !");
        await page.click('#wan_setup_InternetGatewayDevice_WANDevice_2_WANConnectionDevice_1_WANPPPConnection_1__reset');

        // Done Close Browser
        await browser.close();

        // Waiting For New IP
        console.log("Waiting 10 Seconds For New IP to Take Effect first");
        await delay(10000);
        resolve(true);
    });
}

module.exports = {
    reset_pppoe
}