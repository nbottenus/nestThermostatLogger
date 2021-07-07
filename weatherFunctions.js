/**
 * function to retrieve latest weather forecast for nearby area
 * list of stations:
 * https://forecast.weather.gov/stations.php
 */
function retrieveWeather(stationCode) {

  const weatherArray = [];

  //const stationCode = 'KMRB';
  try {
    const weatherUrl = 'https://api.weather.gov/stations/' + stationCode + '/observations/latest';
    const response = UrlFetchApp.fetch(weatherUrl);
    const weatherData = JSON.parse(response.getContentText());

    // parse the data
    console.log(weatherData.properties);
    const textDescription = weatherData['properties']['textDescription'];
    const tempC = weatherData['properties']['temperature']['value'];
    const tempF = convertCtoF(tempC);
    // const dewpointC = weatherData['properties']['dewpoint']['value'];
    // const dewpointF = convertCtoF(dewpointC);
    // const windDirection = weatherData['properties']['windDirection']['value'];
    // const windSpeed = weatherData['properties']['windSpeed']['value'];
    // const barometricPressure = weatherData['properties']['barometricPressure']['value'];
    // const seaLevelPressure = weatherData['properties']['seaLevelPressure']['value'];
    // const visibility = weatherData['properties']['visibility']['value'];
    const relativeHumidity = weatherData['properties']['relativeHumidity']['value'];
    // const windChill = weatherData['properties']['windChill']['value'];

    // add to array
    weatherArray.push(
      textDescription,
      // tempC,
      tempF,
      // dewpointC,
      // dewpointF,
      // windDirection,
      // windSpeed,
      // barometricPressure,
      // seaLevelPressure,
      // visibility,
      relativeHumidity,
      // windChill
    );
  }
  catch (e) {
    console.log('Error: ' + e);
  }
  console.log(weatherArray);
  
  return weatherArray;

}

/**
 * Retrieve latest weather measurements from openweathermap
 * 
 * note that this provides different outputs than the original function
 */
function retrieveOpenWeather(zip) {
  const weatherArray = [];

  try {
    const weatherUrl = 'api.openweathermap.org/data/2.5/weather?zip='+zip+',us&units=imperial&appid='+OPEN_WEATHER_ID;
    const response = UrlFetchApp.fetch(weatherUrl);
    const weatherData = JSON.parse(response.getContentText());

    // parse the data
    console.log(weatherData);


    const textDescription = weatherData['weather'][0]['main'];
    const tempF = weatherData['main']['temp'];
    // const windDirection = weatherData['wind']['deg'];
    // const windSpeed = weatherData['wind']['speed'];
    // const barometricPressure = weatherData['main']['pressure'];
    const humidity = weatherData['main']['humidity'];
    const clouds = weatherData['clouds']['all'];
    // add to array
    weatherArray.push(
      textDescription,
      tempF,
      //windDirection,
      //windSpeed,
      //barometricPressure,
      humidity,
      clouds
    );
  }
  catch (e) {
    console.log('Error: ' + e);
  }
  console.log(weatherArray);
  
  return weatherArray;

}