import "mocha";
import { Done } from "mocha";
import { expect } from "chai";
import axios from "axios";
import { readFileSync } from "fs";

import { resources } from "./resorces"

let port = 3333;
const testUrl = "https://www.amazon.com/Brooks-Ghost-Grey-Alloy-Oyster/dp/B08QV8YT7X/ref=sr_1_2?c=ts&keywords=Men%27s+Road+Running+Shoes&qid=1655268681&s=apparel&sr=1-2&ts_id=14210389011";
const testName = "Brooks Men's Ghost 14 Running Shoes";
const className = "a-offscreen";

before(function (done: Done) {
    this.timeout(8000);
    (async () => {
        try {
            const configData = readFileSync(resources.configPath).toString();
            const conf = JSON.parse(configData);
            if (typeof conf === "object" && typeof conf.port === "number" && conf.port > 0 && conf.port < 65535) port = conf.port;
            done();
        } catch (e) {
            done(e);
        }
    })();
});

describe('Testing main commands', function() {
    it(`/post ok`, function(done: Done) {
      this.timeout(30000);
      (async ()=> {
          try {
              const { data } = await axios.post(`http://localhost:${port}/api/data`, {
                url: testUrl,
                name: testName,
                className,
              });

              expect(data.status).to.be.equal("ok");
              done();
          } catch(e) {
              console.log(e);
              done(e);
          }
      })();
    });
    it(`/post wrong_format`, function(done: Done) {
        this.timeout(8000);
        (async ()=> {
            try {
                await axios.post(`http://localhost:${port}/api/data`, {
                  url: "https://www.amazon.com/Brooks-Ghost-Grey-Alloy-Oyster/dp/B08QV8YT7X/ref=sr_1_2?c=ts&keywords=Men%27s+Road+Running+Shoes&qid=1655268681&s=apparel&sr=1-2&ts_id=14210389011",
                  name: "Brooks Men's Ghost 14 Running Shoes",
                });
            } catch(e) {
                if (e.response.data.status === "wrong_format") done();
                else done(e);
            }
        })();
      });
    it(`/get`, function(done: Done) {
        this.timeout(8000);
        (async ()=> {
            try {
                const { data } = await axios.get(`http://localhost:${port}/api/brooks`);

                expect(data).to.be.an("array");
                expect(data[0]).to.be.an("object");
                expect(data[0].url).to.be.equal(testUrl);
                expect(data[0].name).to.be.equal(testName);
                done();
            } catch(e) {
                console.log(e);
                done(e);
            }
        })();
    });
});
