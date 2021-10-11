const { JSDOM } = require("jsdom");
function analyze(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const selectInnerText = (selector) => document.querySelector(selector)?.innerText?.toString() || null;
    const selectTextContent = (selector) => document.querySelector(selector)?.textContent?.toString() || null;
    const selectInnerHTML = (selector) => document.querySelector(selector)?.innerHTML?.toString() || null;
    // console.log(document.querySelector("#contents-article .title").textContent);
    const title = selectInnerHTML("#top_header .top_title");
    const subtitle = selectInnerHTML("#top_header .sub_title1_new");
    const author = selectInnerHTML("#top_header .author a");
    var time = selectTextContent("#top_header .lasttime");
    const registerDate = null
    const editDate = null
    const date = time;
    const body = selectTextContent("#article_body .art_txt");
    return { "title": title, "author": author, "date": date, "body": body }
}

module.exports = analyze;

// https://www.mk.co.kr/news/society/view/2021/10/960553/