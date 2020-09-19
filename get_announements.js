const puppeteer = require('puppeteer');
require('dotenv').config();

module.exports = (announcementLink, announcementNumber) => {
    return new Promise(async (resolve, reject) => {
        // Prepare link
        announcementLink += announcementNumber;

        // Go to edusoftweb
        const browser = await puppeteer.launch({args: ['--single-process']});
        const page = await browser.newPage();
        let screenshotPath = `${process.env.SCREENSHOTS_DIR_PATH}/${announcementNumber}.jpg`;
        try {
            await page.goto(announcementLink);
    
            var title, description;
    
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
        } catch (e) {
            console.log(e);
        } finally {
            await browser.close();
            resolve([title, description, announcementLink, screenshotPath, announcementNumber]);
        }
    });
}

