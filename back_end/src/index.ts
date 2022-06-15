import fs from "fs";
import { Builder, Capabilities, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { join } from "path";
import http from "http";
// nevertheless on computer must be installed Chrome
import chromedriver from "chromedriver";
import express, { Request, Response } from "express";
import cors from "cors";

type DataToFetch = {
    url: string;
    name: string;
}

type Data = DataToFetch & {
    price: string;
}

type UrlData = (DataToFetch & {
    elementId?: string;
    className?: string;
})[];

// TODO use databse to get list of URL
const URLs = [{
    url: "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-Regular/dp/B00V88DL72/",
    className: "a-offscreen",
    name: "Nike Men's Flex Experience Run 8 Sneaker",
}, {
    url: "https://www.ebay.com/itm/Original-Athletic-Nike-Air-Jordan-1-High-Men-Shoes-Basketball-Sneakers-Men-Sport/393064783017",
    elementId: "prcIsum",
    name: "Athletic Nike Air Jordan 1 High Men Shoes"
}, {
    url: "https://www.ebay.com/itm/354056048583?epid=2318126464&hash=item526f628fc7:g:YrgAAOSwPNJieUk-&amdata=enc%3AAQAHAAAA4EvavMHwhb9NdfzfixPjVcQH9I37mlvrSzUeQ8%2BhGrw7uQVekfYw6Pp68%2B7KNy51pa95apRHNpSnIDiBooMaCWi9v7ftKrb4pymOZl%2FWrhgXMTubjZ6Q4W8FiNmWjx737CW7EmBPlnaiUmyUCxjM8m5LIBav%2BAIZbA6yuQGgtLnboihxLEKiuyPhNDTR9Qr9co9ysm73xWSzRfNvuE6h9ziFyZYc9N9WNcjJwdzLREWeZLOXI%2BZjWL2jdsDXixCXpCJAPdPLKOdSxnIcWC5l%2FFW9vwkPI8ECgBa96e9NynKH%7Ctkp%3ABFBM_Iv3w6tg",
    elementId: "prcIsum",
    name: "Nike Air Force 1 Low '07 White White White Sneaker Men's"
}, {
    url: "https://www.ebay.com/itm/354056048903?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D239816%26meid%3Df91f5786b5794a1ea3bfae4299e084e9%26pid%3D101224%26rk%3D1%26rkt%3D5%26sd%3D354056048583%26itm%3D354056048903%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DSimplAMLv9PairwiseWebWithToraOnlyWithNoAdFeeBoost%26brand%3DNike&_trksid=p2047675.c101224.m-1&amdata=cksum%3A354056048903f91f5786b5794a1ea3bfae4299e084e9%7Cenc%3AAQAHAAABEP%252BcPT6LkLRg6Ozid4LDk7AkcXAXUO1hcSFS56SMJqqzR1F2kkKB4FqjZjgpzh2dtlGyXJ%252BdNm53dgDfowIzqJAFxOCauq6A6CeQWZXQ0f%252FRHCYQrfGFgJJdiO2J%252BPG7PArF5dc9qjvwcIv1DweE6qPnYpLMymay%252F55HBdoXVEtt2%252FV9qS1oQjY2fKSIzImLvqpCYwXGwWhFfEz2%252Fzp87RgR%252FF6nOkcaONPiLEHYKAx%252FAy%252Bgr9GZDwV5vMzeS1hWOanPhRV864FkCNxZ2HVQ%252BdSpty%252BQMsTDmY54WbmAcQ5HEa5i%252F12hW8JceZP94WmdRqRo7iTeWco4n5%252Bdieo98i%252FdwOyogmT1tkwzPQ7cFgkw%7Campid%3APL_CLK%7Cclp%3A2047675",
    elementId: "prcIsum",
    name: "Jordan 1 Mid Paris White White NEW Sneaker DR8038-100 Women's"
}, {
    url: "https://www.ebay.com/itm/165530179186?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D20201210111314%26meid%3Da1db510c78b24ef78a36cc07410d07ca%26pid%3D101195%26rk%3D3%26rkt%3D5%26sd%3D354056048903%26itm%3D165530179186%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DSimplAMLv9PairwiseWebMskuAspectsV202110NoVariantSeedWithRevOpt90NoRelevanceKnnRecallV1%26brand%3DJordan&_trksid=p2047675.c101195.m1851&amdata=cksum%3A165530179186a1db510c78b24ef78a36cc07410d07ca%7Cenc%3AAQAHAAABQAoNKsJM3HOHkM0OuV9XKcsoXSMLk3wBBxTIYdgqgcSsJbD%252BWQW2%252Fi9%252FH9y8TZ%252F9TU3Es3oTKRolT9u5mF91RnSGjcRDdDpXI3GNi9QMheFP623sd2luaveQWWobQW5%252FER46kz2qCKUTYYGx0ptsTnt4dqNH1lp0BLBt%252FBvVcPDH84KKAqZ3KVaVs3b%252BH%252BmZSobLJYqp%252BzxhXVgq5BN2FAe6v%252FjyXgVH82cO1l%252FW9Bvt4FFoNOVz5%252B9jtdaY0c7LImfsf0vZdbF6afJomevvP7Sh%252BF%252BRWMkm5sA%252BrOQkeShqj9NFDugKl0mYPvlnz0FGbU2AYkIu4Rvceqp5xjvxfhev8GlvKKLbZop5A9ykNt6Jl6x9NGeOYIdaNjjCR2gyz9UQ3Nj8vX4ARcJ5%252BzMUWaEjDKnSL5Ku69sRgxArvvex%7Campid%3APLX_CLK%7Cclp%3A2047675",
    elementId: "prcIsum_bidPrice",
    name: "Nike Jordan 1 high og sp fragment x travis scott"
}];

const data: Array<Data> = [];

let flows = 1;
let port = 5000;
const configData = fs.readFileSync("./config.json").toString();
const conf = JSON.parse(configData);
if (typeof conf === "object" && typeof conf.flows === "number" && conf.flows > 0) flows = conf.flows;
if (typeof conf === "object" && typeof conf.port === "number" && conf.port > 0 && conf.port < 65535) port = conf.port;

(async () => {
    let driver = [];
    const parts = Math.ceil(URLs.length / flows);

    try {
        const service = new chrome.ServiceBuilder(chromedriver.path).build();
        chrome.setDefaultService(service);

        const requests = [];
        for (let i = 0; i < parts; i++) {
            // TODO chrome Builders also can work by Promise.all
            driver[i] = await new Builder().withCapabilities(Capabilities.chrome()).build();
            requests.push(askHTMLPage(URLs.splice(0, flows), driver[i]));
        }
        await Promise.all(requests);
    } catch(err) {
      console.log(err);  
    } finally {
        for (let i = 0; i < parts; i++) {
            if (driver[i]) await driver[i].quit();
        }

        console.log("Get initial data after start");
    }
  })();


  async function askHTMLPage(urls: UrlData, driver: WebDriver) {
    const { length } = urls;

    for (let i = 0; i < length; i++) {
        const { url, className, elementId, name } = urls[i];
        const selector = className
            ? By.className(className)
            : elementId
                ? By.id(elementId!)
                : null;
        if (selector === null) continue;

        await driver.get(url);
        try {
            // const price = await driver.wait(until.elementLocated(selector), 1).getAttribute('innerHTML');
            const price = await driver.findElement(selector).getAttribute("innerHTML");

            data.push({
                url, price, name
            });
        } catch(err) {
            continue;
        }
    }
}

const app = express();

app.use(express.json());
app.use(cors());

app.get(`/api/:name`, (req: Request, res: Response) => {
    const name = req.params.name.toLowerCase();

    const filtredData = data.filter(el => el.name.toLowerCase().indexOf(name) !== -1);
    res.json(filtredData);
});

app.post('/api/data', async (req: Request, res: Response) => {
    const data = req.body;
    let isValidData = true;

    if (typeof data !== "object") isValidData = false;
    if (typeof data.url !== "string" || data.url.indexOf("http") === -1) isValidData = false;
    if (typeof data.name !== "string" || data.name.length < 1) isValidData = false;
    if (typeof data.className !== "string" && typeof data.elementId !== "string") isValidData = false;
    if (!data.className && !data.elementId) isValidData = false;

    if (!isValidData) {
        res.status(400);
        res.json({ status: "wrong_format" });
        return;
    }

    try {
        const driver = await new Builder().withCapabilities(Capabilities.chrome()).build();
        await askHTMLPage([data], driver);
        driver.quit();
        res.json({ status: "ok" });
    } catch(err) {
        res.status(500);
        res.json({ status: "error" });
    }
});

app.use(express.static(join(__dirname, "..", "front_end", "build")));

const server = http.createServer(app);

server.listen(port, () => {
    console.log("Express is on port: ", port);
});
