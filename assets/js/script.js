var usersContainer = document.getElementById('users');
var fetchButton = document.querySelector('#fetch-button');

var latInput = '44.34';
var lonInput = '-10.99';
var apiKey = 'bfaa3809424ecd171e99f41a51df3779';

function getApi() {
  var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=' + apiKey;
  console.log(requestUrl)
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //Using console.log to examine the data
      console.log(data);
    //   for (var i = 0; i < data.length; i++) {
        //Creating a h3 element and a p element
        // var userName = document.createElement('h3');
        // var userUrl = document.createElement('p');

        // //Setting the text of the h3 element and p element.
        // userName.textContent = data[i].login;
        // userUrl.textContent = data[i].url;

        // //Appending the dynamically generated html to the div associated with the id="users"
        // //Append will attach the element as the bottom most child.
        // usersContainer.append(userName);
        // usersContainer.append(userUrl);
    //   }
    });
}
fetchButton.addEventListener('click', getApi);
