const { replaceAll } = require("./util");
replaceAll()

const DOMStrDict = new Map([[/&/g, '&amp;'], [/"/g, '&quot;'], [/'/g, '&#39;'], [/</g, '&lt;'], [/>/g, '&gt;']])
const DOMtoStr = (str) => { for (const [key, value] of DOMStrDict) { str = str.replaceAll(key, value); } return str }
const StrtoDOM = (str) => { for (const [key, value] of DOMStrDict) { str = str.replaceAll(value, key); } return str }
const ELEM = (element, selector) => element.querySelector(selector);
const ELEMS = (element, selector) => element.querySelectorAll(selector);
const IT = (element, selector) => element.querySelector(selector)?.innerText?.toString();
const TC = (element, selector) => element.querySelector(selector)?.textContent?.toString();
const IH = (element, selector) => element.querySelector(selector)?.innerHTML?.toString();

function analyze(url, document) {
    var topHeader = ELEM(document, '#top_header');
    const title = TC(topHeader, ".top_title");
    const subtitle = IH(topHeader, ".sub_title1_new");
    const author = TC(topHeader, ".news_title_author a");
    var date = IH(topHeader, '.news_title_author .lasttime');
    var [register, edit] = date?.split('&nbsp;');
    const registerDate = register?.trim().slice(5);
    const editDate = edit?.slice(5);

    const body = TC(document, "#article_body > div");
    for (const element of ELEMS(document, "#Content > div.left_content > div.tagbox > a")) {
        element.outHTML = `<a href=${element.href}>${element.textContent}</a>`;
    }
    const tag = IH(document, "#Content > div.left_content > div.tagbox");

    return new Map([["URL", url], ["Title", title], ["Subtitle", subtitle], ["Author", author], ["RegisterDate", registerDate], ["EditDate", editDate], ["Body", body], ["Tag", tag]])
}

module.exports = analyze;

// https://www.mk.co.kr/news/society/view/2021/10/960553/
