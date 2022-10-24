const container = document.querySelector('.container');
const content = document.querySelector('.hidden');
const button = document.querySelector('.button');
const input = document.querySelector('input');
const temperature_container_div = document.querySelector('.temperature-container');
const temperature_div = document.querySelector('.temperature');
const feels_like_div = document.querySelector('.feels-like-temperature');
const weather_div = document.querySelector('.weather');
const wind_speed_div = document.querySelector('.wind-speed');
const humidity_div = document.querySelector('.humidity');
const gif_div = document.querySelector('.gif-container');
const location_div = document.querySelector('.location');
const SERVER_PATH = 'http://localhost:3000/weather'

button.addEventListener('click', ()=>{
    processWeather();
    if (!content.classList.contains('content')){
        showContentBlock()
    }
});

function showContentBlock() {
    content.classList.add('content');
}

async function processWeather(){
    let city = input.value;
    let weather = await getData(city);
}

async function getData(city){
    let request = `${SERVER_PATH}?city=${city}`;
    let response = await fetch(request, {mode: 'cors'});
    let data = await response.json();
    if (!data.success){
        visualizeError(data, city);
    } else {
        visualizeData(data, city); 
    }
}

function visualizeError(data, city){
    clearData()
    hideInfoDivs()

    let gif = data['gif_url'];
    temperature_container_div.style.backgroundImage = `url('${gif}')`;

    if(data.message=='404'){
        location_div.textContent = `Sorry, city "${city}" wasn't found`;
    } else {
        location_div.textContent = `Unknown error`;
    }
}

function visualizeData(weather, city){
    if (weather_div.style.display == 'none'){
        showInfoDivs()
    }

    location_div.textContent = capitalizeFirstLetter(city);
    temperature_div.textContent = `${weather.data['temp']}°C`;
    feels_like_div.textContent = `Feels like: ${weather.data['feels_like']}°C`;
    weather_div.textContent = `Weather: ${capitalizeFirstLetter(weather.data['gen_weather_character'])}`;
    wind_speed_div.textContent = `Wind speed: ${weather.data['wind_speed']} km/h`;
    humidity_div.textContent = `Humidity: ${weather.data['humidity']}%`;
    
    container.classList.forEach(element=>container.classList.remove(element));
    container.classList.add('container');
    container.classList.add(weather.data['gen_weather'].toLowerCase());

    let gif = weather['gif_url'];

    temperature_container_div.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.2)), url('${gif}')`;
}

function clearData(){
    temperature_div.textContent = '';
    feels_like_div.textContent = '';
    weather_div.textContent = '';
    wind_speed_div.textContent = '';
    humidity_div.textContent = '';
}

function hideInfoDivs(){
    weather_div.style.display = 'none';
    wind_speed_div.style.display = 'none';
    humidity_div.style.display = 'none';
}

function showInfoDivs(){
    weather_div.style.display = 'flex';
    wind_speed_div.style.display = 'flex';
    humidity_div.style.display = 'flex';
}

function capitalizeFirstLetter(string){
    return string[0].toUpperCase() + string.substring(1);
}

