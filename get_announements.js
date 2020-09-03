const puppeteer = require('puppeteer');
require('dotenv').config();

module.exports = (announcementLink, announcementNumber) => {
    return new Promise(async (resolve, reject) => {
        // Prepare link
        announcementLink += announcementNumber;

        // Go to edusoftweb
        const browser = await puppeteer.launch({args: ['--single-process']});
        const page = await browser.newPage();
        await page.goto(announcementLink);

        var title, description;
        let screenshotPath = `${process.env.SCREENSHOTS_DIR_PATH}/${announcementNumber}.jpg`;

        let info = await page.$$('.TextThongTin');

        let titlespan = await info[0].$('span');
        if (titlespan)
            title = await (await titlespan.getProperty('innerText')).jsonValue();

        let descriptionspan = await info[1].$('span');
        if (descriptionspan)
            description = await (await descriptionspan.getProperty('innerText')).jsonValue();
        
        if (!title) {
            await browser.close();
            reject('No new announcement was found!');
            return;
        }

        await page.setViewport({width:1000, height:1000});
        await page.screenshot({ 
            path: screenshotPath,
            type:"jpeg",
            fullPage:false
        });
        await browser.close();
        resolve([title, description, announcementLink, screenshotPath, announcementNumber]);
    });
}

// function test() {
//     return new Promise(async (resolve, reject) => {
//         // Go to edusoftweb
//         const browser = await puppeteer.launch({ args: ['--single-process'] });
//         const page = await browser.newPage();
//         let announcementLink = 'http://edusoftweb.hcmiu.edu.vn/default.aspx?page=chitietthongtin&id=';
//         let announcementNumber = 1061;
//         announcementLink += announcementNumber
//         await page.goto(announcementLink);

//         var title, description;
//         let screenshotPath = `./screenshots/${announcementNumber}.jpg`;

//         let info = await page.$$('.TextThongTin');

//         let titlespan = await info[0].$('span');
//         if (titlespan)
//             title = await (await titlespan.getProperty('innerText')).jsonValue();

//         let descriptionspan = await info[1].$('span');
//         if (descriptionspan)
//             description = await (await descriptionspan.getProperty('innerText')).jsonValue();

//         if (!title) {
//             await browser.close();
//             reject('No new announcement was found!');
//             return;
//         }

//         await page.setViewport({ width: 1000, height: 1000 });
//         await page.screenshot({
//             path: screenshotPath,
//             type: "jpeg",
//             fullPage: false
//         });
//         await browser.close();
//         resolve([title, description, screenshotPath]);
//     })
// }

// test().then((data) => console.log(data), (data) => console.log(data));
