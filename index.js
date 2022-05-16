var cors = require('cors')
const express = require('express')
const script = require('./weather_data_scrapper_script')

const app = express()

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.get("/api",cors(), (req, res) => {
    // /api?l=jamtara
    console.log(req.query.l || "delhi");
    script(req, res)
})


app.listen(4000, () => {
    console.log(`server started at 4000`);
})
