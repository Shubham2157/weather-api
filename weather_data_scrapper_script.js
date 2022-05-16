module.exports = (req, res) => {
    const axios = require('axios').default;
    var JSSoup = require('jssoup').default;

    const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    // US english
    const LANGUAGE = "en-US,en;q=0.5"

    var URL = "https://www.google.com/search?lr=lang_en&ie=UTF-8&q=weather"
    const region = req.query.l || "delhi"
    URL += region

    axios({
        method: 'get',
        url: URL,
        headers: { "User-Agent": USER_AGENT, "Accept-Language": LANGUAGE, "Content-Language": LANGUAGE }
    })
        .then(function (response) {
            var soup = new JSSoup(response.data)
            //console.log(response.data)

            //console.log(soup.find("div", attrs={"id": "wob_loc"}).text);
            // store all results on this object
            result = { 
                "region": null,
                "temp_now": null,
                "dayhour": null,
                "weather_now": null,
                "precipitation":null,
                "humidity":null,
                "wind":null,
                "next_days_data": null 
            }
            // extract region
            result['region'] = soup.find("div", attrs = { "id": "wob_loc" }).text
            // extract temperature now
            result['temp_now'] = soup.find("span", attrs = { "id": "wob_tm" }).text
            // get the day and hour now
            result['dayhour'] = soup.find("div", attrs = { "id": "wob_dts" }).text
            // get the actual weather
            result['weather_now'] = soup.find("span", attrs = { "id": "wob_dc" }).text

            // get the precipitation
            result['precipitation'] = soup.find("span", attrs = { "id": "wob_pp" }).text
            // get the % of humidity
            result['humidity'] = soup.find("span", attrs = { "id": "wob_hm" }).text
            // extract the wind
            result['wind'] = soup.find("span", attrs = { "id": "wob_ws" }).text

            //console.log(result)


            // get next few days' weather
            next_days = []
            days = soup.find("div", attrs = { "id": "wob_dp" })
            days.findAll("div", attrs = { "class": "wob_df" }).forEach(day => {
                // extract the name of the day
                day_name = day.findAll("div")[0].attrs['aria-label']
                // get weather status for that day
                weather = day.find("img").attrs["alt"]
                temp = day.findAll("span", { "class": "wob_t" })
                // maximum temparature in Celsius, use temp[1].text if you want fahrenheit
                max_temp = temp[0].text
                // minimum temparature in Celsius, use temp[3].text if you want fahrenheit
                min_temp = temp[2].text
                next_days.push({ "name": day_name, "weather": weather, "max_temp": max_temp, "min_temp": min_temp })
            });

            result.next_days_data = next_days
            //console.log(result.next_days_data);

            res.json(result)

        });
}