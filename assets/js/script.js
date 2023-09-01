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
var currentConditionsDiv = document.querySelector('#current-conditions-display');
var futureConditionsDiv = document.querySelector('#future-conditions-display');


function formatUnixTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

var searchedCities = [];

function getCoordinates(buttonCity) {
    if(buttonCity){
        city = buttonCity;
    }else{
        city = cityInput.value;
    }
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + APIKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            lat = data[0].lat;
            lon = data[0].lon;
            weatherQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + APIKey + '&units=imperial';
            getFutureWeather(buttonCity);
        });
}

function getFutureWeather(buttonCity){
    if(buttonCity){
        city = buttonCity;
    }
    fetch(weatherQueryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function(data){
        futureConditionsDiv.innerHTML = '';
        cityNameFromServer = data.city.name // gets the name

        var futureWeathercard = document.createElement('div');
        // Gets the date, temp, wind, and humidity of a city
        var futureWeatherList = [];
        var futureWeatherObject = {};
        for(var i = 8; i < 40; i += 8){ // gets the next five days at midnight
            
            // Save the date, temp, wind, and humidity as a variable and format it
            date = formatUnixTime(data.list[i].dt);
            tempF = data.list[i].main.temp + " °F";
            wind = data.list[i].wind.speed + ' MPH';
            humidity = data.list[i].main.humidity + '%';

            futureWeatherList = [tempF, wind, humidity];

            if (!futureWeatherObject[cityNameFromServer]){
                futureWeatherObject[cityNameFromServer] = {};
            }

            futureWeatherObject[cityNameFromServer][date] = futureWeatherList;
            // Create the cards for forecasted weather 
            var futureWeathercard = document.createElement('div');
            futureWeathercard = document.createElement('div');
            futureWeathercard.classList.add('future-weather-card');
            futureWeathercard.innerHTML = `<p> ${date} <br>Temp: ${tempF}<br>Wind: ${wind}<br>Humidity: ${humidity}<br>`
            futureConditionsDiv.appendChild(futureWeathercard);

            localStorage.setItem(`${cityNameFromServer}`, JSON.stringify(futureWeatherObject));
        }        
        // Now outside for loop

        var futureWeatherString = '';
        for (var date in futureWeatherObject[cityNameFromServer]) {
            futureWeatherString += `${date}: ${futureWeatherObject[cityNameFromServer][date].join(', ')}<br>`;
        }

        // Store the combined future weather data string in local storage
        var storedCityData = localStorage.getItem(cityNameFromServer);
        var cityData = storedCityData ? JSON.parse(storedCityData) : {};
        cityData.future = futureWeatherString;
        localStorage.setItem(cityNameFromServer, JSON.stringify(cityData));
        // Save the date, temp, wind, and humidity as a variable and format it
         // For whatever reason it did not want to create all 5 future days so the last one I created manually
        var dateLast = formatUnixTime(data.list[38].dt); 
        var tempFLast = data.list[38].main.temp + " °F";
        var windLast = data.list[38].wind.speed + ' MPH';
        var humidityLast = data.list[38].main.humidity + '%';

        
    
        futureWeathercard = document.createElement('div');
        futureWeathercard.classList.add('future-weather-card');
        futureWeathercard.innerHTML = `<p> ${dateLast} <br>Temp: ${tempFLast}<br>Wind: ${windLast}<br>Humidity: ${humidityLast}<br>`
        futureConditionsDiv.appendChild(futureWeathercard);    
    })
};


function getCurrentWeather(buttonCity) {
    var pEl = document.createElement('p');
    pEl.innerHTML = '';
    if(buttonCity){
        city = buttonCity;
    }
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey + '&units=imperial')
        .then(function(response){
            return response.json();
        })
        .then(function(data){

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

function populateCityHistory() {
    var cityHistorySection = document.querySelector('#cityHistory');
    searchedCities.forEach(function (city) {
        var cityButton = document.createElement('button');
        cityButton.classList.add('city-history');
        cityButton.textContent = city.toUpperCase();
        cityButton.addEventListener('click', function () {
            getCurrentWeather(cityButton.textContent);
            getCoordinates(cityButton.textContent);
        });
        cityHistorySection.appendChild(cityButton);
    });
}

function populateCurrentWeather(data) {
    var tempF = data.main.temp + " °F";
    var wind = data.wind.speed + ' MPH';
    var humidity = data.main.humidity + '%';
    
    var containerDiv = document.createElement('div');
    var pEl = document.createElement('p');
    pEl.innerHTML = `${data.name} ${formatUnixTime(data.dt)}<br>Temp: ${tempF}<br>Wind: ${wind}<br>Humidity: ${humidity}<br>`;
    containerDiv.appendChild(pEl);
    
    currentConditionsDiv.innerHTML = ''; // Clear existing content
    currentConditionsDiv.appendChild(containerDiv);
    
    // Store current weather data in localStorage
    localStorage.setItem('currentWeather', JSON.stringify(data));
}

function populateFutureWeather(data) {
    futureConditionsDiv.innerHTML = ''; // Clear existing content
    cityNameFromServer = data.city.name;

    var futureWeatherObject = {};

    for (var i = 8; i < 40; i += 8) {
        date = formatUnixTime(data.list[i].dt);
        tempF = data.list[i].main.temp + " °F";
        wind = data.list[i].wind.speed + ' MPH';
        humidity = data.list[i].main.humidity + '%';

        if (!futureWeatherObject[cityNameFromServer]) {
            futureWeatherObject[cityNameFromServer] = {};
        }

        futureWeatherObject[cityNameFromServer][date] = [tempF, wind, humidity];

        var futureWeathercard = document.createElement('div');
        futureWeathercard.classList.add('future-weather-card');
        futureWeathercard.innerHTML = `<p> ${date} <br>Temp: ${tempF}<br>Wind: ${wind}<br>Humidity: ${humidity}<br>`;
        futureConditionsDiv.appendChild(futureWeathercard);
    }

    // Save the future weather data in localStorage
    saveCityData(cityNameFromServer, JSON.stringify(futureWeatherObject));

    // Manually create and append the last day's future weather card
    var dateLast = formatUnixTime(data.list[38].dt);
    var tempFLast = data.list[38].main.temp + " °F";
    var windLast = data.list[38].wind.speed + ' MPH';
    var humidityLast = data.list[38].main.humidity + '%';

    var futureWeathercardLast = document.createElement('div');
    futureWeathercardLast.classList.add('future-weather-card');
    futureWeathercardLast.innerHTML = `<p> ${dateLast} <br>Temp: ${tempFLast}<br>Wind: ${windLast}<br>Humidity: ${humidityLast}<br>`;
    futureConditionsDiv.appendChild(futureWeathercardLast);
}


// Modify the function that handles the search button click
searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    city = cityInput.value.trim().toLowerCase(); // Convert to lowercase and trim whitespace
    getCurrentWeather();
    getCoordinates();

    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        var cityHistorySection = document.querySelector('#cityHistory');
        var cityButton = document.createElement('button');
        cityButton.classList.add('city-history');
        cityButton.textContent = city.toUpperCase();
        cityButton.addEventListener('click', function () {
            getCurrentWeather(cityButton.textContent);
            getCoordinates(cityButton.textContent);
        });
        cityHistorySection.appendChild(cityButton);

        // Save the searched cities to localStorage
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
    }
});


// Add an event listener to retrieve and populate searched cities on page load
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve searched cities from localStorage
    var storedSearchedCities = localStorage.getItem('searchedCities');
    if (storedSearchedCities) {
        searchedCities = JSON.parse(storedSearchedCities);
        populateCityHistory(); // Populate the city history section
    }

    // Retrieve and populate current weather data from localStorage
    var storedCurrentWeather = localStorage.getItem('currentWeather');
    if (storedCurrentWeather) {
        var currentWeatherData = JSON.parse(storedCurrentWeather);
        populateCurrentWeather(currentWeatherData);
    }
});