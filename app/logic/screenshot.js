const puppeteer = require('puppeteer');

const handleImgur = async (page) => {
    const imageContainer = 'div.post-image-container';
    await page.waitFor(imageContainer);

    const firstContainer = await page.$eval(imageContainer, el => el.id);
    let pic = 'https://i.imgur.com/';

    if (firstContainer === null) return;
    
    pic += firstContainer  + '.jpg';
    await page.goto(pic);  
};

const screenshot = async (url, imgName) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    await page.goto(url);
    await page.waitFor(5000);
    if (url.indexOf('imgur') !== -1)
        await handleImgur(page);

    await page.screenshot({
        path: './app/public/img/projects/' + imgName,

    });

    await browser.close();
};

module.exports = (url, imgName) => {
    return screenshot(url, imgName);
};