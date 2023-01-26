//WHEN THE USER CLICKS INFO ON CITY APPEARS WITH FUNCTION
$('document').ready(function() {
    //ADD CLICK EVENT TO START THE WHOLE THING
    $('#start-btn').on("click", function() {
        //NEED TO GET THE SEARCH VAL INPUT
        let searchedCity = $('#search-value').val();
        //WHEN THE INPUT IS EMPTY
        $('#search-value').val(" ");
        //NEED TO USE WEATHER APP API TO GET INFO
        getWeather(searchedCity);
        weatherForecast(searchedCity);//this is for the 5 day forecast
    });


//NEED TO PULL PREVIOUS HISTORY FOR LISTINGS
let history = JSON.parse(localStorage.getItem("history")) || [];

//NEED TO SET HISTORY TO CORRECT LENGTH
if(history.length > 0) {
    getWeather(history[history.length - 1]);
}
//NEED TO MAKE ROW FOR EACH ELEMENT IN THE HISTORY ARRAY
for(let i = 0; i < history.length; i++){
    createRow(history[i]);
}
//NEED A FUNCTION TO MAKE LIST OF HISTORY
function createRow(text){
    let listEl = $("<li>").addClass("list-none").text(text);
    $("#search-history").append(listEl);
}

//NEED AN EVENT LISTENER TO LIST ITEM
$("#search-history").on("click", "li", function() {
    getWeather($(this).text());
    weatherForecast($(this).text());
});

// NEED TO GET WEATHER INFO WITH A FUNCTION
function getWeather(searchedCity){

    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=6b490bf0f6476248bee4dafc71b2b9a1",
        dataType: "json",
    }).then(function(data) {
        console.log(data);
        if(history.indexOf(searchedCity) === -1){
            history.push(searchedCity);
            //NEED TO PUSH searchedCity TO HISTORY ARRAY
            localStorage.setItem("history", JSON.stringify(history));
            createRow(searchedCity);
        
        }

        $("#current-weather").empty();

        //TODAY'S DATE using java
        let todayDate = new Date().toLocaleDateString();
        //NEED TO CREATE AND STYLE THE CURRENT WEATHER SECTION AND 5DAY FORECAST CARDS
        let title = $("<h2>").addClass("font-bold text-xl mb-2").text(data.name + " (" + todayDate + ")");
        let img = $("<img>").addClass("w-full").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        let card = $("<div>").addClass("max-w-sm rounded overflow-hidden shadow-lg");
        let cardBody = $("<div>").addClass("px-6 py-4");
        let wind = $("<p>").addClass("text-gray-700 text-base").text("Wind Speed: " + data.wind.speed + " mph");
        let humidity = $("<p>").addClass("text-gray-700 text-base").text("Humidity: " + data.main.humidity + " %");
        //GAVE ME TEMP IN KELVIN NEED TO CONVERT IT TO F
        let kelvinToF = (data.main.temp - 273.15) * 9/5 + 32; 
        let fTemp = kelvinToF.toFixed(2);
        let temp = $("<p>").addClass("text-gray-700 text-base").text("Temperature: " + fTemp + " °F");
        //GETTING THE LAT AND LON
        let lon = data.coord.lon;
        let lat = data.coord.lat;

    //NEED TO USE ANOTHER FETCH TO GET CITY WEATHER INFO WITH COORDS
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=6b490bf0f6476248bee4dafc71b2b9a1&lat=" + lat + "&lon=" + lon,
        dataType : "json",
    }).then(function(response) {
        console.log(response);
    });
        //NOW APPEND THE NEW ELEMENTS
            title.append(img);
            cardBody.append(title, temp, humidity, wind);
            card.append(cardBody);
            $("#current-weather").append(card);
        });
    }

    //NEED A FUNCTION FOR THE 5 DAY FORECAST
    function weatherForecast(searchedCity) {
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchedCity + "&appid=6b490bf0f6476248bee4dafc71b2b9a1",
        dataType : "json",
    }).then(function(data){
        $("#five-day-forecast").html("<h3 class=\"mt-4 text-xl bold\">5-Day Forecast:</h3>").append("<div class=\"flex flex-row\">");
        console.log(data);

        //NEED TO LOOP TO CREATE 5 CARDS
        for(let i = 0; i < data.list.length; i++) {

            if(data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                
                let title5 = $("<h2>").addClass("font-bold text-xl mb-2 text-gray-700").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                let img5 = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                let col5 = $("<div>").addClass("max-w-sm rounded overflow-hidden shadow-lg");
                let card5 = $("<div>").addClass("max-w-sm rounded overflow-hidden shadow-lg bg-primary text-white");
                let cardBody5 = $("<div>").addClass("px-6 py-4 p-2");
                let wind5 = $("<p>").addClass("text-gray-700 text-base").text("Wind Speed: " + data.list[i].wind.speed + "mph");
                let humid5 = $("<p>").addClass("text-gray-700 text-base").text("Humidity: " + data.list[i].main.humidity + "%");

                let kelvinT = (data.list[i].main.temp - 273.15) * 9/5 + 32; 
                let FTemp = kelvinT.toFixed(2);
                let temp5 = $("<p>").addClass("text-gray-700 text-base").text("Temperature: " + FTemp + " °F");

                col5.append(card5.append(cardBody5.append(title5, img5, temp5, humid5, wind5)));
                $("#five-day-forecast .flex-row").append(col5);
            }
        }
    });
}

});