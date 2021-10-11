const fetch = require("node-fetch");

const NewsChannelDict = new Map([
    ["www.hani.co.kr", "hani"],
    ["www.mk.co.kr", "mk"]

]);

class NewsViewer {
    constructor(url) { this.url = url; }

    async html() {
        if (this.htmlData === undefined) {
            let response = await fetch(this.url);
            this.htmlData = response.status === 200 ? response.text() : null;
        }
        return this.htmlData
    }

    async content() {
        if (this.contentData === undefined) {
            let url = new URL(this.url);
            if (NewsChannelDict.has(url.hostname) && await this.html()) {
                let analyze = require(`./${NewsChannelDict.get(url.hostname)}`);
                this.contentData = analyze(await this.html());
            }
            this.contentData = this.contentData || null
        }
        return this.contentData
    }
}

module.exports = NewsViewer