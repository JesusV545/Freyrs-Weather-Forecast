

//WHEN THE USER CLICKS INFO ON CITY APPEARS WITH FUNCTION
$('document').ready(function() {
    //ADD CLICK EVENT TO START THE WHOLE THING
    $('.start-btn').on("click", function() {
        //NEED TO GET THE SEARCH VAL INPUT
        let searchedCity = $('#search-value').val();
        //WHEN THE INPUT IS EMPTY
        $('#search-value').val(" ");
        //NEED TO USE WEATHER APP API TO GET INFO
        getWeather(searchedCity);
    })
})

// NEED TO GET WEATHER INFO WITH A FUNCTION
function getWeather(searchedCity){

    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=6b490bf0f6476248bee4dafc71b2b9a1",
        dataType: "json",
    }).then(function(data) {
        console.log(data);
        
    //GETTING LONGITUDE AND LATITUDE & SET LON AND LAT TO A VARIABLE TO USE ON OTHER FETCH
    let lon = data.coord.lon;
    let lat = data.coord.lat;
    //NEED TO USE ANOTHER FETCH TO GET CITY WEATHER INFO WITH COORDS
    $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=6b490bf0f6476248bee4dafc71b2b9a1&lat=" + lat + "&lot=" + lon,
        dataType : "json",
    }).then(function(response) {
        console.log(response);
    })
        
});
    
        

}










//WHEN THE USER SEARCHES ANOTHER CITY PRECIOUS CITY NEEDS TO LIST BELOW SEARCHES

//NEED TO USE LOCAL STORAGE TO SAVE PREVIOUS SEARCHES














