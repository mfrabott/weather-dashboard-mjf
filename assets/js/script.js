var usersContainer = document.getElementById('users');
var fetchButton = document.querySelector('#fetch-button');
var citySelector = document.querySelector('#city-input');
var selectedCity = "";
var apiKey = '99afeda6d0c563b7397dc3f6cc43fdd6';
var currentHumidityEl = document.querySelector('#current-humidity');
var currentDateEl = document.querySelector('#current-day');
var currentTimeEl = document.querySelector('#current-time');
var currentTempEl = document.querySelector('#current-temp');
var currentConditionEl = document.querySelector('#current-condition');
var currentWindEl = document.querySelector('#current-wind');
var forecast = document.querySelector('.display-weather');
var currentConditionIcon = document.querySelector('#current-icon')
var cityDisplay = document.querySelector('#city-name');
var savedCitiesEl = document.querySelector('.searched-cities')
var fiveDayEl = document.querySelector('.five-day-forecast');


// Get saved cities from local storage
var savedCities = JSON.parse(localStorage.getItem('savedCities')) ?? [];;
  
  // Hides past results
  var displaySavedCities = function() {
  var existingCityButtons = savedCitiesEl.getElementsByTagName('button');
  for (i=0; i<existingCityButtons.length; i++){
    existingCityButtons[i].setAttribute('style', 'display: none')
  }

  // Populate buttons from saved storage
  for (i=0; i<savedCities.length; i++) {
    var cityButton = document.createElement('button')
    cityButton.textContent = savedCities[i].city;
    cityButton.classList.add('col-xs-7', 'col-sm-6', 'col-lg-3', 'col-xl-2')
    cityButton.addEventListener('click', function(event) {
      getCoordinatesApi(this.textContent);
    });
    savedCitiesEl.appendChild(cityButton);
  };
};

displaySavedCities();

// Current Weather
function getCurrentWeatherApi(latitude, longitude, displayCity) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=' + apiKey;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (currentWeather) {
        // Get and populate current weather data
        var currentHumidity= currentWeather.main.humidity;
        var currentDate = dayjs.unix(currentWeather.dt).format('dddd, MMMM D, YYYY ');
        var currentTime = dayjs.unix(currentWeather.dt).format('h:mm A');
        var weatherIcon = currentWeather.weather[0].icon;
        var currentTemp = currentWeather.main.temp.toFixed(0);
        var currentCondition = currentWeather.weather[0].main;
        var windSpeed = currentWeather.wind.speed.toFixed(0);
        currentWindEl.textContent = 'Wind Speed: ' + windSpeed + ' mph';
        cityDisplay.textContent = displayCity;
        currentConditionIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+weatherIcon + '.png')
        currentConditionEl.textContent = currentCondition;
        currentDateEl.textContent = currentDate;
        currentTimeEl.textContent = currentTime;
        currentHumidityEl.textContent = 'Humidity: ' + currentHumidity + '%';
        currentTempEl.textContent = 'Temperature: ' + parseFloat(currentTemp) + '°F';
        forecast.setAttribute("style", "display: inline")
      });
      displaySavedCities();
  };


// 5-day API
function getFiveDayApi(latitude, longitude) {
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
    fetch(requestUrl)
    
    .then(function (response) {
      return response.json();
    })

    .then(function (fiveDayData) {

      // Hides past results
      var existingDailyCards = fiveDayEl.getElementsByTagName('*');     
      for (i=0; i<existingDailyCards.length; i++){
        existingDailyCards[i].setAttribute('style', 'display: none')
      }

      // Get and populate five-day forecast
      for (i=0; i<fiveDayData.list.length; i++){
        var maxTemp = fiveDayData.list[i].main.temp_max.toFixed(0);
        var fullDateTime = dayjs(fiveDayData.list[i].dt_txt).toDate();
        var displayDay = dayjs(fullDateTime).format('dddd');
        var displayDate = dayjs(fullDateTime).format('MMMM D,YYYY');
        var time = dayjs(fullDateTime).format('h:mmA')
        var weatherCondition = fiveDayData.list[i].weather[0].main;
        var dailyWeatherIcon = fiveDayData.list[i].weather[0].icon;
        var dailyWind = fiveDayData.list[i].wind.speed
        var dailyHumidity = fiveDayData.list[i].main.humidity;

        // Only populate one set of data/day
        if (time === '3:00PM'){
          var dailyCard = document.createElement('div');
          dailyCard.classList.add('card','m-2', 'daily-card', 'col-10', 'col-md-4', 'col-lg-2');
          fiveDayEl.appendChild(dailyCard)
          var cardDay = document.createElement('h5');
          cardDay.textContent = displayDay;
          cardDay.classList.add('card-title')
          dailyCard.appendChild(cardDay);
          var cardDate = document.createElement('h5');
          cardDate.textContent = displayDate;
          cardDate.classList.add('card-title')
          dailyCard.appendChild(cardDate);
          var dailyIcon = document.createElement('img')
          dailyIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+ dailyWeatherIcon + '.png');
          dailyCard.appendChild(dailyIcon);
          var dailyCondition = document.createElement('p')
          dailyCondition.classList.add('cardText')
          dailyCondition.textContent = weatherCondition;
          dailyCard.appendChild(dailyCondition)
          var dailyHigh = document.createElement('p')
          dailyHigh.classList.add('cardText')
          dailyHigh.textContent = parseFloat(maxTemp) + '°F';
          dailyCard.appendChild(dailyHigh)
          var dailyHumidityEl = document.createElement('p')
          dailyHumidityEl.classList.add('cardText')
          dailyHumidityEl.textContent = 'Humidity: ' + dailyHumidity + '%';
          dailyCard.appendChild(dailyHumidityEl)
          var dailyWindEl = document.createElement('p')
          dailyWindEl.classList.add('cardText')
          dailyWindEl.textContent = 'Wind Speed: ' + dailyWind + ' mph';
          dailyCard.appendChild(dailyWindEl)
        };
      };
    });
};


// Geocode API - get coordinates from user city input
function getCoordinatesApi(city) {
      var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            var displayCity = data[0].name;

            var newCity = {
              city: displayCity,
              lat: latitude,
              lon: longitude
            };
            
            // check to see if searched city is already saved before adding to list
            var index = savedCities.findIndex(object => object.city === newCity.city)
            if (index === -1){
              savedCities.push(newCity)
            };

            // Append to local storage
            localStorage.setItem('savedCities', JSON.stringify(savedCities));

            getFiveDayApi(latitude, longitude);
            getCurrentWeatherApi(latitude, longitude, displayCity);
        });
};


//checks whether the pressed key is "Enter"
citySelector.addEventListener("keydown", function (event) {
    if (event.code === "Enter") {  
        var selectedCity = event.target.value;
        getCoordinatesApi(selectedCity);
    }
});

fetchButton.addEventListener("click", function (event) {
      var selectedCity = citySelector.value;
      getCoordinatesApi(selectedCity);
});