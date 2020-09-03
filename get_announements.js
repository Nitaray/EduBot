const puppeteer = require('puppeteer');

module.exports = (announcementLink) => {
    return new Promise(async (resolve, reject) => {
        // Go to edusoftweb
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(announcementLink);

        let info = await page.$$('.TextThongTin');
        let title = await (await (await info[0].$('span')).getProperty('innerText')).jsonValue();
        let description = await (await (await info[1].$('span')).getProperty('innerText')).jsonValue();
        
    });
}

function test() {
    return new Promise(async (resolve, reject) => {
        // Go to edusoftweb
        const browser = await puppeteer.launch();
        await browser.version().then((version) => console.log(version));
        const page = await browser.newPage();
        console.log('Check 2');
    //   await page.goto('http://edusoftweb.hcmiu.edu.vn/default.aspx?page=chitietthongtin&id=1060');
    //   console.log('Check 3');

    //   let info = await page.$$(".TextThongTin");
    //   let title = await (
    //     await (await info[0].$("span")).getProperty("innerText")
    //   ).jsonValue();
    //   console.log(title);
    //   let description = await (
    //     await (await info[1].$("span")).getProperty("innerText")
    //   ).jsonValue();
    //   console.log(description);
    //   await browser.close();
    //   resolve(title);
        await browser.close();
        resolve(1);
    });
}

console.log(test());
