import "dotenv/config.js";
import express from 'express';
import fetch from 'node-fetch'
import cors from 'cors'
const app = express();
const PORT = 3000;

app.use(cors({
    origin:'*'
}))

app.get('/weather', async (req, res) => {
    try {
        let city = req.query.city;
        let raw_data = await getData(city);
        let data = ExtractData(raw_data)
        let gif_url = await getGifURL(data.gen_weather)
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.json({
            success: true,
            data: data,
            gif_url: gif_url
        })
        res.status(200).end()
    } catch (err) {
        let gif_url = '';
        if (err.message=="404"){
            gif_url = await getGifURL('not found')
        } else {
            gif_url = await getGifURL('error')
        }
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
		return res.status(Number(err.message)).json({
			success: false,
			message: err.message,
            gif_url: gif_url
		})
    }
});

app.listen(PORT, () => {
    console.log(`Application listening on port ${PORT}!`);
});

function ExtractData(data){
    let obj = {};
    obj.gen_weather = data.weather[0].main;
    obj.gen_weather_character = data.weather[0].description;
    obj.temp =  Math.round(translateFromKelToCel(data.main.temp));
    obj.feels_like = Math.round(translateFromKelToCel(data.main.feels_like));
    obj.humidity = data.main.humidity;
    obj.wind_speed = data.wind.speed;
    return obj;
}

async function getData(city){
    let request = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(request,{mode: 'cors'});
    if (response.status==404){
        throw Error(response.status);
    } 
    const data = await response.json();
    return data;    
}

async function getGifURL(word){
    if (word == 'Clear'){
        word = 'Sun'
    } 

    let request = `https://api.giphy.com/v1/gifs/translate?api_key=${process.env.GIPHY_API_KEY}&s=${word}`;
    const response = await fetch(request,{mode: 'cors'});
    const data = await response.json();
    return data.data.images.original.url;
}


function translateFromKelToCel(far_temp){
    return far_temp - 273.15;
}
