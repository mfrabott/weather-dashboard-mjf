var usersContainer = document.getElementById('users');
var fetchButton = document.querySelector('#fetch-button');

var latInput = '44.34';
var lonInput = '-10.99';
var apiKey = '99afeda6d0c563b7397dc3f6cc43fdd6';


// Geocode API
function getCoordinatesApi() {
      var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + ',' + {stateCode} + ',' + {countryCode} + '&limit=' + {limit} + '&appid=' + apiKey;
      console.log(requestUrl)
      fetch(requestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
        console.log(data);
        });
    };


// 5-day API
function getFiveDayApi() {
//   var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=-10.99&appid=' + apiKey;
  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latInput + '&lon=' + lonInput + '&appid=' + apiKey;
  console.log(requestUrl)
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
    console.log(data);
    });
};

fetchButton.addEventListener('click', getCoordinatesApi);

