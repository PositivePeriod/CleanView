const express = require("express");
const cors = require("cors");
const NewsViewer = require("./viewer/news/news");

const app = express();
app.set("views", __dirname + "/views"); // __dirname is based on server.js
app.set("view engine", "ejs");
app.use(cors());

const doAsync = fn => async (req, res, next) => await fn(req, res, next).catch(next);
app.get("/news/*", doAsync(async function (req, res, next) {
    var viewer = new NewsViewer(req.url.slice(6));
    var content = await viewer.content();
    if (content) { res.render("news", { "time": new Date().toString(), "content": content }); }
    else { res.send(await viewer.html()); }
}));

app.use((req, res, next) => {
    console.log("404", req.url);
    res.status(404).send("Nothing in here");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
    console.log(`Personal page of Jeuk Hwang listening on port ${port}`);
    console.log(`http://localhost:${port}`);
});