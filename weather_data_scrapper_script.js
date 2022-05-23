module.exports = (req, res) => {
    const axios = require('axios').default;
    var JSSoup = require('jssoup').default;

    const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    // US english
    const LANGUAGE = "en-US,en;q=0.5"

    var URL = "https://www.google.com/search?lr=lang_en&ie=UTF-8&q=weather"
    const region = req.query.place || "delhi"
    URL += region

    axios({
        method: 'get',
        url: URL,
        headers: { "User-Agent": USER_AGENT, "Accept-Language": LANGUAGE, "Content-Language": LANGUAGE, "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3" }
    })
        .then(function (response) {
            var soup = new JSSoup(response.data)
            //var language = window.navigator.userLanguage || window.navigator.language;
            //console.log(navigator.languages) //works IE/SAFARI/CHROME/FF
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

            let date = new Date();
            let date_day = date.getDate() - 1;

            days.findAll("div", attrs = { "class": "wob_df" }).forEach(day => {

                date_full = (date_day += 1) + "/"+ date.getMonth() + "/" + date.getFullYear();
                // extract the name of the day
                day_name = day.findAll("div")[0].attrs['aria-label']
                // get weather status for that day
                weather = day.find("img").attrs["alt"]
                temp = day.findAll("span", { "class": "wob_t" })
                // maximum temparature in Celsius, use temp[1].text if you want fahrenheit
                max_temp = temp[0].text
                // minimum temparature in Celsius, use temp[3].text if you want fahrenheit
                min_temp = temp[2].text
                next_days.push({ "name": day_name, "weather": weather, "max_temp": max_temp, "min_temp": min_temp, "date": date_full })
            });

            result.next_days_data = next_days
            //console.log(result.next_days_data);

            res.json(result)

        }).catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              //console.log(error.response.data);
              console.log("ERROR IN RESPOSE BLOCK");
            //   console.log(error.response.status);
            //   console.log(error.response.headers);

            res.json({
                "message": "Error Occurred!!!!!, Please try again later",
                "Ststus": 500
            })


            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
             // console.log(error.request);
              console.log("ERROR IN REQUEST BLOCK");
              
              res.json({
                "message": "Error Occurred!!!!!, Please try again later",
                "Ststus": 500
            })

            } else {
              // Something happened in setting up the request that triggered an Error
              //console.log('Error', error.message);
              console.log("ERROR 500");              
              res.json({
                "message": "Error Occurred!!!!!, Please try again later",
                "Ststus": 500
            })
            }
                    
          });;
}