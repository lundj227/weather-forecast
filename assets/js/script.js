var APIKey = '77474d0ff5f19ebba232a4c922f3b44b'; // variable for the API key
var searchBtn = document.querySelector('#searchBtn');
var cityInput = document.querySelector('#searchInput');
var city;
var weatherQueryURL = 'api.openweathermap.org/data/2.5/forecast?lat='+ `${lat}` + '&lon=' + `${lon}` + '&appid=' +  `${APIKey}`;
var coordinatesQueryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
var lat;
var lon;
var tempK;
var tempF;
var date;
var wind;
var cityNameFromServer;
var humidity;

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
            weatherQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat='+ `${lat}` + '&lon=' + `${lon}` + '&appid=' +  `${APIKey}`;
            getWeather();
        });
}

function getWeather(){
    fetch(weatherQueryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        console.log(data);
        // Save the city name from the server as a variable
        cityNameFromServer = data.city.name // gets the name
        console.log(cityNameFromServer); // logs name 
        // Gets the date, temp, wind, and humidity of a city
        for(var i = 0; i < 40; i += 8){ // gets the next five days at midnight
            
            // Save the date as a variable
            date = data.list[i].dt_txt; 
            console.log(date); 

            // Save the temperature as a variable
            tempK = data.list[i].main.temp;
            tempF = (tempK - 273.15)*(9/5) + 32;
            tempF = tempF.toFixed(2);
            tempF = tempF + " °F" ;
            console.log(tempK, tempF);

            // Save the wind data as a variable
            wind = data.list[i].wind.speed + ' MPH';
            console.log(wind);

            // Save the humidity data as a variable
            humidity = data.list[i].main.humidity + '%';
            console.log(humidity);
        }
    })
};


searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    getCoordinates();
});