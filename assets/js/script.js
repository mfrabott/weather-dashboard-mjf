var usersContainer = document.getElementById('users');
var fetchButton = document.querySelector('#fetch-button');
var citySelector = document.querySelector('#city-input');
var selectedCity = "";
var apiKey = '99afeda6d0c563b7397dc3f6cc43fdd6';

var currentHumidityEl = document.querySelector('#current-humidity');
var currentDateTimeEl = document.querySelector('#current-day');
var currentTempEl = document.querySelector('#current-temp');
var currentConditionEl = document.querySelector('#current-condition');
var currentWindEl = document.querySelector('#current-wind');
var forecast = document.querySelector('.display-weather');
var currentConditionIcon = document.querySelector('#current-icon')
var cityDisplay = document.querySelector('#city-name');
var savedCitiesEl = document.querySelector('.searched-cities')
var fiveDayEl = document.querySelector('.five-day-forecast');


var savedCities = JSON.parse(localStorage.getItem('savedCities')) ?? [];;
var displaySavedCities = function() {
  var existingCityButtons = savedCitiesEl.getElementsByTagName('button');
  
  // Hides past results
  for (i=0; i<existingCityButtons.length; i++){
    existingCityButtons[i].setAttribute('style', 'display: none')
  }

  for (i=0; i<savedCities.length; i++) {
    var cityButton = document.createElement('button')
    cityButton.textContent = savedCities[i].city;
    cityButton.addEventListener('click', function(event) {
      getCoordinatesApi(this.textContent);
    });

    savedCitiesEl.appendChild(cityButton);
  };
};

displaySavedCities();

// Current Weather
function getCurrentWeatherApi(latitude, longitude, displayCity) {
  //   var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=-10.99&appid=' + apiKey;
    var requestUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=imperial&appid=' + apiKey;
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (currentWeather) {
        console.log(currentWeather);
        var currentHumidity= currentWeather.main.humidity;
        // var currentDateTime = dayjs(currentWeather.dt).format('dddd, MMMM D,YYYY h:mmA');
      //  TODO format day/date
        // var currentDay = '';
        // var currentDate = '';
        var weatherIcon = currentWeather.weather[0].icon;
        var currentTemp = currentWeather.main.temp.toFixed(0);
        var currentCondition = currentWeather.weather[0].main;
        var windSpeed = currentWeather.wind.speed.toFixed(0);
        currentWindEl.textContent = 'Wind Speed: ' + windSpeed + ' mph';
        cityDisplay.textContent = displayCity;
        currentConditionIcon.setAttribute('src', 'https://openweathermap.org/img/wn/'+weatherIcon + '.png')
        currentConditionEl.textContent = currentCondition;
        // currentDateTimeEl.textContent = currentDateTime;
        currentHumidityEl.textContent = 'Humidity: ' + currentHumidity + '%';
        currentTempEl.textContent = 'Temperature: ' + parseFloat(currentTemp) + '°F';
        forecast.setAttribute("style", "display: inline")
      });
      displaySavedCities();
  };


// 5-day API
function getFiveDayApi(latitude, longitude) {
//   var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=-10.99&appid=' + apiKey;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
    fetch(requestUrl)
    
    .then(function (response) {
      return response.json();
    })

    .then(function (fiveDayData) {
      console.log(fiveDayData);
    
      var existingDailyCards = fiveDayEl.getElementsByTagName('*');
  
      // Hides past results
      for (i=0; i<existingDailyCards.length; i++){
        existingDailyCards[i].setAttribute('style', 'display: none')
      }

      for (i=0; i<fiveDayData.list.length; i++){
        var minTemp = fiveDayData.list[i].main.temp_min;
        var maxTemp = fiveDayData.list[i].main.temp_max.toFixed(0);
        var fullDateTime = dayjs(fiveDayData.list[i].dt_txt).toDate();
        var displayDay = dayjs(fullDateTime).format('dddd');
        var displayDate = dayjs(fullDateTime).format('MMMM D,YYYY');
        var time = dayjs(fullDateTime).format('h:mmA')
        var weatherCondition = fiveDayData.list[i].weather[0].main;
        var dailyWeatherIcon = fiveDayData.list[i].weather[0].icon;

        if (time === '3:00PM'){
          var dailyCard = document.createElement('div');
          dailyCard.classList.add('card','m-2', 'daily-card');
          dailyCard.setAttribute('style', 'width: 14rem');
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
        }
      };



    });
};


// Geocode API
function getCoordinatesApi(city) {
      var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
    //   var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + ',' + {stateCode} + ',' + {countryCode} + '&limit=' + {limit} + '&appid=' + apiKey;
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            var displayCity = data[0].name;

            var newCity = {
              city: displayCity,
              lat: latitude,
              lon: longitude
              
            }

            var index = savedCities.findIndex(object => object.city === newCity.city)
            if (index === -1){
              savedCities.push(newCity)
            };

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
      var selectedCity = event.target.value;
      getCoordinatesApi(selectedCity);
});

// fetchButton.addEventListener('click', getCoordinatesApi);