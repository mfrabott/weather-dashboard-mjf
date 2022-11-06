var usersContainer = document.getElementById('users');
var fetchButton = document.querySelector('#fetch-button');

var citySelector = document.querySelector('#cityInput');

var selectedCity = "";

var apiKey = '99afeda6d0c563b7397dc3f6cc43fdd6';



// 5-day API
function getFiveDayApi(latitude, longitude) {
//   var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=-10.99&appid=' + apiKey;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + apiKey;
  console.log(requestUrl)
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (fiveDayData) {
    console.log(fiveDayData);
    var hourlyForecast = fiveDayData.list;
    console.log(hourlyForecast);
    for (k=0; k<fiveDayData.list.length; k++){
        console.log(fiveDayData.list.length)
        console.log(fiveDayData.list[k].dt_txt)
        console.log(fiveDayData.list[k].weather[0].main)
    }
    });
};


// Geocode API
function getCoordinatesApi(city) {
      var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=' + apiKey;
    //   var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + ',' + {stateCode} + ',' + {countryCode} + '&limit=' + {limit} + '&appid=' + apiKey;
      console.log(requestUrl)
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            getFiveDayApi(latitude, longitude)
        });
        
    };


//checks whether the pressed key is "Enter"
citySelector.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  
        var selectedCity = e.target.value;
        console.log(selectedCity);
        getCoordinatesApi(selectedCity);
    }
});


// function validate(e) {

// fetchButton.addEventListener('click', getCoordinatesApi);