$(document).ready(function () {
    var latitude;
    var longitude;
    var tempButton = document.getElementById('temp');

    function success(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        makeAjax(latitude, longitude);

    }

    function updateInfo(response) {
        console.log(response);
        updateWindDirection(response);
        updateTemperature(response);
        updateHumidity(response);
        updateCity(response);
        updateWeatherLogo(response);
        updateBackgroundImage(response, extractTemperature(response));
        tempButton.disabled = false;
    }

    function makeAjax(latitude, longitude) {
        $.ajax({
                url: 'https://fcc-weather-api.glitch.me/api/current',

                data: {
                    lat: latitude,
                    lon: longitude
                },
                success: updateInfo
            }
        );
    }

    function getWindDirection(degrees) {
        if (degrees > 45 && degrees <= 135){
            return 'N';
        } else  if (degrees > 135 && degrees <= 225){
            return 'W';
        } else if (degrees > 225 && degrees <= 315){
            return 'S';
        } else if (degrees > 315 && degrees <= 45){
            return 'E';
        }
    }

    function extractWeatherLogoUrl(jsonResponse) {
        return jsonResponse.weather[0].icon;
    }

    function extractWindDirection(jsonResponse) {
        return jsonResponse.wind.deg;
    }

    function extractTemperature(jsonResponse) {
        var temperature = jsonResponse.main.temp;
        console.log('temp: ', temperature);
        return temperature;
    }

    function extractHumidity(jsonResponse) {
        var humidity = jsonResponse.main.humidity;
        return humidity;
    }

    function extractCity(jsonResponce) {
        var city = jsonResponce.name;
        return city;
    }

    function updateWindDirection(jsonResponse) {
        var windDegrees = extractWindDirection(jsonResponse);
        var windDirection = getWindDirection(windDegrees);
        var windDirectionElement = document.getElementById('wind-direction');
        windDirectionElement.innerText = windDirection;
    }

    function updateTemperature(jsonResponse) {
        var tempElement = document.getElementById('temp');
        tempElement.innerHTML = extractTemperature(jsonResponse)+'&deg;C';
    }

    function updateHumidity(jsonResponse) {
        var humidityElement = document.getElementById('humidity');
        humidityElement.innerText = extractHumidity(jsonResponse)+'%';
    }
    
    function updateCity(jsonResponse) {
        var cityElement = document.querySelector('h1');
        cityElement.innerText = extractCity(jsonResponse);
    }

    function updateWeatherLogo(jsonResponse) {
        var logoElement = document.querySelector('.logo img');
        logoElement.setAttribute('src', extractWeatherLogoUrl(jsonResponse));
    }

    function updateBackgroundImage(jsonResponse, currentTemperature) {
        var backgroundURLs = {
            winter: 'http://www.publicdomainpictures.net/pictures/20000/velka/winter-forest.jpg',
            automn: 'http://allswalls.com/images/nature-autumn-rain-bokeh-depth-of-field-branches-wallpaper-1.jpg',
            summer: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Rub_al_Khali_002.JPG'
        }

        var currentBackgroundURL;
        if (currentTemperature > 20){
            currentBackgroundURL = backgroundURLs.summer;
        } else if (currentTemperature > 5) {
            currentBackgroundURL = backgroundURLs.automn;
        } else {
            currentBackgroundURL = backgroundURLs.winter;
        }

        var backgroundIMGElement = document.querySelector('body');
        backgroundIMGElement.style.background = 'url(' +
            currentBackgroundURL+ ')  no-repeat center bottom fixed';

    }

    function celciusFahrenheitConverter(degrees) {
        var re = /-*\d+\.*\d*/;
        console.log('degree', degrees);
        var temp = degrees.match(re)[0];

        console.log('temp', temp);
        if (/F$/.test(degrees)){
            // console.log((temp - 32)*5/9);
            temp = (temp - 32)*5/9;
            temp = Math.round(temp * 100)/100;
            return String(temp) + '&deg;' + 'C';
        }
        else {
            // console.log(temp * 9 / 5 + 32);
            temp = temp * 9 / 5 + 32;
            temp = Math.round(temp * 100)/100;
            return String(temp) + '&deg;' + 'F';
        }
    }

    tempButton.addEventListener('click', function (event) {
        var tempElement = document.getElementById('temp');
        var currentTemp = tempElement.innerHTML;
        tempElement.innerHTML = celciusFahrenheitConverter(currentTemp);
    });

    navigator.geolocation.getCurrentPosition(success);


});


