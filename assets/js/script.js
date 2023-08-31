var APIKey = '77474d0ff5f19ebba232a4c922f3b44b'; // variable for the API key
var searchBtn = document.querySelector('#searchBtn');
var cityInput = document.querySelector('#searchInput');
var city;
var weatherQueryURL = 'api.openweathermap.org/data/2.5/forecast?lat='+ `${lat}` + '&lon=' + `${lon}` + '&appid=' +  `${APIKey}`;
var coordinatesQueryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
var lat;
var lon;
var tempF;
var date;
var wind;
var cityNameFromServer;
var humidity;
var currentConditionsDiv = document.querySelector('#current-conditions');
var futureConditionsDiv = document.querySelector('#future-conditions');

function formatUnixTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function getCoordinates(){
    city = cityInput.value;
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            lat = data[0].lat;
            lon = data[0].lon;
        })
        .then(function(){
            weatherQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ `${lat}` + '&lon=' + `${lon}` + '&appid=' +  `${APIKey}` + '&units=imperial';
            getFutureWeather();
        });
}

function getFutureWeather(){
    fetch(weatherQueryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        futureConditionsDiv.innerHTML = '';
        cityNameFromServer = data.city.name // gets the name
        console.log(cityNameFromServer);
        console.log(data);

        var containerDiv = document.createElement('div'); // Create a container div
        var futureWeathercard = document.createElement('div');
        // Gets the date, temp, wind, and humidity of a city
        for(var i = 8; i < 40; i += 8){ // gets the next five days at midnight
            
            // Save the date as a variable and format it
            date = formatUnixTime(data.list[i].dt); 
            //console.log(date); 

            // Save the temperature as a variable and format it
            tempF = data.list[i].main.temp;
            tempF = tempF + " °F" ;
            //console.log(tempF);

            // Save the wind data as a variable and format it
            wind = data.list[i].wind.speed + ' MPH';
            //console.log(wind);

            // Save the humidity data as a variable and format it
            humidity = data.list[i].main.humidity + '%';
            //console.log(humidity);

            // Create the cards for forecasted weather 
            //var futureWeathercard = document.createElement('div');
            futureWeathercard = document.createElement('div');
            futureWeathercard.classList.add('future-weather-card');
            futureWeathercard.innerHTML = `<p> ${date} <br>Temp: ${tempF}<br>Wind: ${wind}<br>Humidity: ${humidity}<br>`
            futureConditionsDiv.appendChild(futureWeathercard);
        }        
        // Now outside for loop
        // Save the date as a variable and format it
        var dateLast = formatUnixTime(data.list[38].dt); 
        
        var tempFLast = data.list[38].main.temp;
        tempFLast = tempF + " °F" ;
        
        // Save the wind data as a variable and format it
        var windLast = data.list[38].wind.speed + ' MPH';
        // Save the humidity data as a variable and format it
        var humidityLast = data.list[38].main.humidity + '%';
        // For whatever reason it did not want to create all 5 future days so the last one I created manually
        futureWeathercard = document.createElement('div');
        futureWeathercard.classList.add('future-weather-card');
        futureWeathercard.innerHTML = `<p> ${dateLast} <br>Temp: ${tempFLast}<br>Wind: ${windLast}<br>Humidity: ${humidityLast}<br>`
        futureConditionsDiv.appendChild(futureWeathercard);
    })
};


function getCurrentWeather() {
    var pEl = document.createElement('p');
    pEl.innerHTML = '';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=imperial')
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);

            // Extract relevant data from the response
            var tempF = data.main.temp + " °F";
            var wind = data.wind.speed + ' MPH';
            var humidity = data.main.humidity + '%';

            // Create a container div
            var containerDiv = document.createElement('div');

            // Create a paragraph to display current conditions
            var pEl = document.createElement('p');
            pEl.innerHTML = `${data.name} ${formatUnixTime(data.dt)}<br>Temp: ${tempF}<br>Wind: ${wind}<br>Humidity: ${humidity}<br>`;
            containerDiv.appendChild(pEl);

            // Clear existing content and add the new containerDiv
            currentConditionsDiv.innerHTML = '';
            currentConditionsDiv.appendChild(containerDiv);
        })
        .catch(function(error) {
            console.log('Error:', error);
        });
}

searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    city = cityInput.value;
    getCurrentWeather();
    getCoordinates(); 
});