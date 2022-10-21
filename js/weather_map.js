$(function() {
    // mapbox map that has a draggable marker
    mapboxgl.accessToken = MAPBOX_MAP_API_TOKEN;
    const coordinates = document.getElementById('coordinates');
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [-98.48527, 29.423017], // starting position [lng, lat]
        zoom: 11, // starting zoom
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // create a new marker object
    const marker = new mapboxgl.Marker({
        draggable: true
    }).setLngLat([-98.48527, 29.423017])
        .addTo(map);

    function onDragEnd() {
        let lngLat = marker.getLngLat();
        lngLat = Object.values(lngLat);
        updatedWeatherForecast(lngLat);
    }

    marker.on('dragend', onDragEnd);

    // This is the initial API request for San Antonio forecast
    $.get("http://api.openweathermap.org/data/2.5/forecast", {
        APPID: OPEN_WEATHER_APPID,
        lat:    29.423017,
        lon:   -98.48527,
        units: "imperial"
    }).done(function(data) {
        console.log(data);
        $("#city-name").html(`Current City: ${data.city.name}`);
        for (let i = 0; i < data.list.length; i++) {
            if ( i % 8 === 0) {
                $("#forecast-card").append(`
                    <div class="card-wrapper">
                        <p class="date py-2 mb-2">${formatTime(data.list[i].dt)}</p>
                        <div class="temp">
                            <p class="m-0">${data.list[i].main.temp}<sup>o</sup>F</p>
                            <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="">
                        </div>
                        <div class="des">
                            <p class="mb-3">Description: ${data.list[i].weather[0].description}</p>
                            <p class="mb-3">Humidity: ${data.list[i].main.humidity}</p>
                        </div>
                        <p class="mb-3">Wind: ${windCardinalDirection(data.list[i].wind.deg)}</p>
                        <p class="mb-3 bt-light">Pressure: ${data.list[i].main.pressure}</p>
                    </div>
                `);
            }
        }
    });

// =======================================================================================//
    function windCardinalDirection (degrees) {
        let cardinalDirection = '';
        if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
            cardinalDirection = "N";
        } else if (degrees > 11.25 && degrees  <= 33.75) {
            cardinalDirection = "NNE";
        } else if (degrees > 33.75 && degrees <= 56.25) {
            cardinalDirection = "NE";
        } else if (degrees > 56.25 && degrees <= 78.75) {
            cardinalDirection = "ENE";
        } else if (degrees > 78.75 && degrees <= 101.25) {
            cardinalDirection = "E";
        } else if (degrees > 101.25 && degrees <= 123.75) {
            cardinalDirection = "ESE";
        } else if (degrees > 123.75 && degrees <= 146.25) {
            cardinalDirection = "SE";
        } else if (degrees > 146.25 && degrees <= 168.75) {
            cardinalDirection = "SSE";
        } else if (degrees > 168.75 && degrees <= 191.25) {
            cardinalDirection = "S";
        } else  if (degrees > 191.25 && degrees <= 213.75) {
            cardinalDirection = "SSW";
        } else if (degrees > 213.75 && degrees <= 236.25)  {
            cardinalDirection = "SW";
        } else if (degrees > 236.25 && degrees <= 258.75) {
            cardinalDirection = "WSW";
        } else if (degrees > 258.75 && degrees <= 281.25) {
            cardinalDirection = "W";
        } else if (degrees > 281.25 && degrees <= 303.75) {
            cardinalDirection = "WNW";
        } else if (degrees > 303.75 && degrees <= 326.25) {
            cardinalDirection = "NW";
        } else if (degrees > 326.75 && degrees <= 348.75) {
            cardinalDirection = "NNW";
        }
        return cardinalDirection;
    }
    // the appendLeadingZeroes function append zero to hour, minutes and seconds
    function appendLeadingZeroes(n){
        if (n <= 9) {
            return "0" + n;
        }
        return n;
    }

    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    // The format function formats the time stamp
    function formatTime(timeStamp){
        let dateTime = new Date(timeStamp * 1000);
        let year = dateTime.getFullYear();
        let month = months[dateTime.getMonth()];
        let day = dateTime.getDate();
        let hour = appendLeadingZeroes(dateTime.getHours());
        let minutes = appendLeadingZeroes(dateTime.getMinutes());
        let seconds = appendLeadingZeroes(dateTime.getSeconds());
        let formattedDateTime = month + " " + day + " " + year + " " + hour + ":" + minutes + ":" + seconds;
        return formattedDateTime;
    }

// ====================================================================================//
    // update the weather card based on the new API response passed from
    // the updatedWeatherForecast function
    function weatherForecastCards(data) {
        $("#forecast-card").empty();
        for (let i = 0; i < data.list.length; i++) {
            if ( i % 8 === 0) {
                $("#forecast-card").append(`
                    <div class="card-wrapper">
                        <p class="date py-2 mb-2">${formatTime(data.list[i].dt)}</p>
                        <div>
                            <p class="m-0">${data.list[i].main.temp}<sup>o</sup>F</p>
                            <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="">
                        </div>
                        <div>
                            <p class="mb-3">Description: ${data.list[i].weather[0].description}</p>
                            <p class="mb-3">Humidity: ${data.list[i].main.humidity}</p>
                        </div>
                        <p class="mb-3">Wind: ${windCardinalDirection(data.list[i].wind.deg)}</p>
                        <p class="mb-3 bt-light">Pressure: ${data.list[i].main.pressure}</p>
                    </div>
                `);
            }
        }
    }
    // this function gets the coordinates and passed it to the http request and
    // pass the data to updateCard function
    function updatedWeatherForecast (coordinate) {
        $.get("http://api.openweathermap.org/data/2.5/forecast", {
            APPID: OPEN_WEATHER_APPID,
            lat:  coordinate[1],
            lon:  coordinate[0],
            units: "imperial"
        }).done(function(data) {
            weatherForecastCards(data);
            $("#city-name").html(`Current City: ${data.city.name}`);
        });
    }

    // generate a new coordinates based on a new location that the
    // user inputs and pass those coordinates to 'updateAPIRequest' function
    document.getElementById("searchButton").addEventListener('click', function(e) {
        e.preventDefault();

        const address = document.getElementById("inputValue").value;

        geocode(address, MAPBOX_MAP_API_TOKEN).then(function(coordinates){
            marker.setLngLat(coordinates)
                .addTo(map);
            map.setCenter(coordinates);

            updatedWeatherForecast(coordinates);
            $("#inputValue").val('');
        });
    });
    // get coordinates when the user enters the new location and
    // the event listener function listens to keyup and if the
    // key the user press is equal to 'enter' run the code with in the block
    $(document).on("keyup", function(event){
        if (event.originalEvent.key === "Enter") {
            const address = document.getElementById("inputValue").value;

            geocode(address, MAPBOX_MAP_API_TOKEN).then(function(coordinates){
                console.log(coordinates);
                marker.setLngLat(coordinates)
                    .addTo(map);
                map.setCenter(coordinates);

                updatedWeatherForecast(coordinates);
                $("#inputValue").val('');
            });
        }
    });

});