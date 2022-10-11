var input_Btn = document.querySelector("#comfirm_Btn");
var cityNameEl = document.querySelector("#cityName");
var cityName = "";
var y = "";
var x = "";

var weatherConditions = {
  weatherId: "",
  weatherTempature: "",
  weatherWind: "",
  weatherHumidity: "",
};

input_Btn.addEventListener("click", (cityName) => {
    cityName = cityNameEl.value;
    if (cityName) {
      var apiSearch =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        cityName +
        "&limit=1&appid=1d74fce1be8d5312d3fcc06f18c3880f";
      fetch(apiSearch).then((response) => {
        response.json().then((data) => {
          y = data[0].lat;
          x = data[0].lon;
          todayWeatherFetch(y, x);
        });
      });
      cityArray.push(cityName);
      window.localStorage.setItem("cityName", JSON.stringify(cityArray));
    }
});

var cityArray = [];
if (window.localStorage.getItem("cityName")) {
  cityArray.push(...JSON.parse(window.localStorage.getItem("cityName")));
}

input_Btn.addEventListener("click", (cityName) => {
    cityName = cityNameEl.value;
    if (cityName) {
      var apiSearch =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        cityName +
        "&limit=1&appid=1d74fce1be8d5312d3fcc06f18c3880f";
      fetch(apiSearch).then((response) => {
        response.json().then((data) => {
          y = data[0].lat;
          x = data[0].lon;
          WeekWeatherInfo(y, x);
        });
      });
    } else {
      return;
    }
});

var todayWeatherFetch = (y, x) => {
  var coordinates =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    y +
    "&lon=" +
    x +
    "&units=imperial&exclude=minutely,hourly,alerts&appid=1d74fce1be8d5312d3fcc06f18c3880f";

  fetch(coordinates).then((response) => {
    response.json().then((data) => {
      weatherConditions.weatherId = data.current.weather[0].id;
      weatherConditions.weatherTempature = data.current.temp;
      weatherConditions.weatherWind = data.current.wind_speed;
      weatherConditions.weatherHumidity = data.current.humidity;
      var cityEl = document.querySelector("#information");
      var cityNameEl = document.querySelector("#Input");
      var cityTemperatureEl = document.querySelector("#Temperature");
      var cityWindEl = document.querySelector("#Wind");
      var cityHumidityEl = document.querySelector("#Humidity");
      cityEl.innerHTML = "";
      cityNameEl.textContent = cityName;
      cityTemperatureEl.textContent =
        "Temperature: " + weatherConditions.weatherTempature + "°C";
      cityWindEl.textContent =
        "Wind Speeds: " + weatherConditions.weatherWind + "MPH";
      cityHumidityEl.textContent =
        "Humidity: " + weatherConditions.weatherHumidity + "%";
      cityEl.appendChild(cityNameEl);
      cityEl.appendChild(cityTemperatureEl);
      cityEl.appendChild(cityWindEl);
      cityEl.appendChild(cityHumidityEl);
    });
  });
};

var WeekWeatherInfo = (y, x) => {
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    y +
    "&lon=" +
    x +
    "&exclude=current,minutely,hourly&appid=1d74fce1be8d5312d3fcc06f18c3880f";
  weatherDisplay(url);
};

var WeekdayList = (number) => {
  var week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return week[number];
};

var celsiusTemperature = (kelvin) => {
  const celsius = Math.floor(kelvin - 273);
  return celsius;
};

async function weatherDisplay(url) {
  var data = await fetch(url);
  var weatherEl = await data.text();
  weatherDetails(weatherEl);
}

var weatherDetails = (weatherEl) => {
  var weatherJSON = JSON.parse(weatherEl);
  var dailyForecast = weatherJSON.daily;
  document.getElementById("WeekWeatherInfo").innerHTML = "";
  for (a = 1; a < dailyForecast.length; a++) {
    var day = dailyForecast[a];
    var currentDay = new Date().getDay() + a;
    if (currentDay > 6) {
      currentDay = currentDay - 7;
    }
    var week = WeekdayList(currentDay);
    var temperature = celsiusTemperature(day.temp.max);
    var humidity = day.humidity;
    var windSpeed = day.wind_speed;
    var displayforecast = "<div class='forecast'/>";
    displayforecast += "<h2>" + week + "</h2>";
    displayforecast += "<p>Temperature: " + temperature + "°C</p>";
    displayforecast += "<p>Wind Speeds: " + Math.round(windSpeed) + " MPH </p> ";
    displayforecast += "<p>Humidity: " + humidity + "%</p>";
    document.getElementById("WeekWeatherInfo").innerHTML += displayforecast;
  }
};
