var cors = require('cors')
const express = require('express')
const script = require('./weather_data_scrapper_script')
const PORT = process.env.PORT || 4000

const app = express()

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.get("/api",cors(), (req, res) => {
    // /api?place=jamtara
    console.log(req.headers["accept-language"]);
    console.log(req.query.place || "delhi");
    script(req, res)
})

app.get("*", (req, res) =>{
    res.send("gusse me idhar udar mat niklo!!!! go to <a href='./api'>/api</a>")
})


app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
})
