const { JSDOM } = require("jsdom");
const { replaceAll } = require("./util");
replaceAll()

function analyze(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const IT = (selector) => document.querySelector(selector)?.innerText?.toString() || null;
    const TC = (selector) => document.querySelector(selector)?.textContent?.toString() || null;
    const IH = (selector) => document.querySelector(selector)?.innerHTML?.toString() || null;
    const DOMStrDict = new Map([[/&/g, '&amp;'], [/"/g, '&quot;'], [/'/g, '&#39;'], [/</g, '&lt;'], [/>/g, '&gt;']])
    const DOMtoStr = (str) => { for (const [key, value] of DOMStrDict) { str = str.replaceAll(key, value); } return str }
    const StrtoDOM = (str) => { for (const [key, value] of DOMStrDict) { str = str.replaceAll(value, key); } return str }
    const title = IH("#contents-article .title");
    var subtitleText = IH("#contents-article .subtitle");
    var subtitle = subtitleText.replaceAll('<br>', '\n').replaceAll('<p align="justify"></p>', '\n');
    const author = IH("#contents-article .name a strong").slice(0, -3);
    const registerDate = TC("#contents-article .date-time span:nth-child(1)").slice(4);
    const editDate = TC("#contents-article .date-time span:nth-child(2)").slice(4);
    var bodyContent = IH("#contents-article .text"); // not good if exists media
    const body = StrtoDOM(bodyContent);
    console.log(body.slice(0, 100));
    // bodyContent = .image-area .image img
    return new Map([["title", title], ["subtitle", subtitle], ["author", author], ["registerDate", registerDate], ["editDate", editDate], ["body", body]])
}

module.exports = analyze;

// https://www.hani.co.kr/arti/society/labor/1014622.html
// https://www.hani.co.kr/arti/international/international_general/1014629.html?_fr=mt2