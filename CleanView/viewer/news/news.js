const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const iconv = require('iconv-lite');

const NewsChannelDict = new Map([
    ["www.hani.co.kr", "hani"],
    ["www.mk.co.kr", "mk"]
]);

const EUCKR = new Set([
    'mk',
]);

function EUCKRtoUTF8(content) {
    return iconv.decode(Buffer.from(content, 'binary'), "euc-kr").toString();
}

class NewsViewer {
    constructor(url) { this.url = url; }

    async html() {
        if (this.htmlData === undefined) {
            let response = await fetch(this.url);
            if (response.status === 200) {
                let url = new URL(this.url);
                this.htmlData = EUCKR.has(url.hostname) ? EUCKRtoUTF8(response.text()) : response.text();
            }
        }
        this.htmlData = this.htmlData || null;
        return this.htmlData
    }

    async document() {
        if (this.documentData === undefined) {
            this.documentData = await new Promise(
                async (resolve) => {
                    var html = await this.html();
                    let dom = await new JSDOM(html);
                    dom.window.addEventListener("load", () => { resolve(dom.window.document); });
                }

            );
        }
        this.documentData = this.documentData || null;
        return this.documentData
    }

    async content() {
        if (this.contentData === undefined) {
            let url = new URL(this.url);
            if (NewsChannelDict.has(url.hostname) && await this.html()) {
                let analyze = require(`./${NewsChannelDict.get(url.hostname)}`);
                this.contentData = await analyze(this.url, await this.document());
            }
        }
        this.contentData = this.contentData || null
        console.log(this.htmlData);
        return this.contentData
    }
}

module.exports = NewsViewer