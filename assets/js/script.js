var APIKey = '77474d0ff5f19ebba232a4c922f3b44b'; // variable for the API key
var searchBtn = document.querySelector('#searchBtn');
var cityInput = document.querySelector('#searchInput');
var city;
var weatherQueryURL = 'api.openweathermap.org/data/2.5/forecast?lat='+ `${lat}` + '&lon=' + `${lon}` + '&appid=' +  `${APIKey}`;
var coordinatesQueryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey;
var lat;
var lon;

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
        console.log(data.city.name); // gets the name 
        for(var i = 0; i < 40; i += 8){
            console.log(i, data.list[i].dt_txt)
        }
        // need to get the temperature wind and humidity over 5 days
        // 0, 8, 16, 24, 32
    })
};


searchBtn.addEventListener('click', function(e){
    e.preventDefault();
    getCoordinates();
});