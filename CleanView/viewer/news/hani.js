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
    var article = ELEM(document, '#contents-article');
    const title = TC(article, ".title");
    const subtitle = IH(article, ".subtitle");
    const author = TC(article, ".name a strong")?.slice(0, -3) || null;
    const registerDate = TC(article, ".date-time span:nth-child(1)")?.slice(4);
    const editDate = TC(article, ".date-time span:nth-child(2)")?.slice(4);

    var text = ELEM(article, ".text");
    for (const element of ELEMS(text, 'p[align=justify]')) { element.outerHTML = '<br>'; }
    for (const element of ELEMS(text, '.image-area')) {
        // if (element.querySelector('.desc')) {
        var img = element.querySelector('img');
        var src = new URL(img.src, url); var desc = TC(element, '.desc');
        element.outerHTML = `<img src=${src} style="${img.style.cssText}">` + (desc ? `<br>${desc}<br>` : `<br>`);
        // } else { element.outerHTML = ''; }
    }
    for (const element of ELEMS(text, '.text a[target=_blank][rel=noopener]')) {
        var src = new URL(element.href, url); var desc = element.textContent;
        element.parentNode.outerHTML = `<a href=${src}>${desc}</a>`;
    }
    for (const element of ELEMS(text, 'script')) { element.outerHTML = ''; }

    for (const element of ELEMS(text, 'span')) { element.outerHTML = element.textContent; }
    var adtag = ELEM(text, '#ad_tag'); if (adtag) { adtag.outerHTML = ''; }
    var newsBox2 = ELEM(text, '#news-box2'); if (newsBox2) { newsBox2.outerHTML = newsBox2.textContent; }
    const body = text.innerHTML;
    // const contact = null; // TODO
    return new Map([["URL", url], ["Title", title], ["Subtitle", subtitle], ["Author", author], ["RegisterDate", registerDate], ["EditDate", editDate], ["Body", body]])
}

module.exports = analyze;

// https://www.hani.co.kr/arti/society/labor/1014622.html
// https://www.hani.co.kr/arti/international/international_general/1014629.html?_fr=mt2
// https://www.hani.co.kr/arti/opinion/column/1011694.html
// https://www.hani.co.kr/arti/cartoon/hanicartoon/1012535.html
// https://www.hani.co.kr/arti/politics/assembly/1014252.html
// https://www.hani.co.kr/arti/politics/politics_general/1014514.html
// https://www.hani.co.kr/arti/opinion/column/1014586.html