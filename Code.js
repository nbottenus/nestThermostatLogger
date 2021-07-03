/**
 * Custom menu to use tool from Sheet UI
 */
function onOpen() {
  
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Smart Device Tool')
    .addItem('Smart Device Tool', 'showSidebar')
    .addSeparator()
    .addItem('Log thermostat data','logThermostatDataAllDevices')
    .addToUi();
  
}

/**
 * list devices to get thermostat IDs
 */
function listDevices() {

  // specify the endpoint
  const endpoint = '/enterprises/' + PROJECT_ID + '/devices';

  // blank array to hold device data
  let deviceArray = [];

  // make request to smart api
  const data = makeRequest(endpoint);
  const deviceData = data.devices;
  console.log(deviceData);

  deviceData.forEach(device => {
    const name = device.name;
    const type = device.type;
    deviceArray.push([name,type]);
  });

  // get the Sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  // output the data
  sheet.getRange(2,1,deviceArray.length,2).setValues(deviceArray);

}

/**
 * function to make request to google smart api
 */
function makeRequest(endpoint) {

  // get the smart service
  const smartService = getSmartService();
  
  // get the access token
  const access_token = smartService.getAccessToken();
  console.log(access_token);

  // setup the SMD API url
  const url = 'https://smartdevicemanagement.googleapis.com/v1';
  //const endpoint = '/enterprises/' + PROJECT_ID + '/devices';

  // setup the headers for the call
  const headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
  }
  
  // set up params
  const params = {
    'headers': headers,
    'method': 'get',
    'muteHttpExceptions': true
  }
  
  // try calling API
  try {
    const response = UrlFetchApp.fetch(url + endpoint, params);
    const responseBody = JSON.parse(response.getContentText());
    
    return responseBody;
  }
  catch(e) {
    console.log('Error: ' + e);
  }
}

/**
 * function to make request to google smart api
 */
function logThermostatDataAllDevices() {

  // get the latest weather data
  const weatherDataArray = retrieveWeather('KMRB');
  console.log(weatherDataArray);
  
  // get the smart service
  const smartService = getSmartService();
  
  // get the access token
  const access_token = smartService.getAccessToken();

  // setup the SMD API url
  const url = 'https://smartdevicemanagement.googleapis.com/v1';
  const endpoint = '/enterprises/' + PROJECT_ID + '/devices';

  // setup the headers for the call
  const headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
  }
  
  // setup the parameters for url fetch
  const params = {
    'headers': headers,
    'method': 'get',
    'muteHttpExceptions': true
  }

  // empty array to hold device data
  let dataArray = [];
  //let smdWeatherArray = [];
  
  // try calling API
  try {

    // url fetch to call api
    const response = UrlFetchApp.fetch(url + endpoint, params);
    const responseCode = response.getResponseCode();
    const responseBody = JSON.parse(response.getContentText());
    
    // log responses
    console.log(responseCode);
    //console.log(responseBody);

    // get devices
    const devices = responseBody['devices'];
    //console.log(devices);

    // create timestamp for api call
    const d = new Date();

    devices.forEach(device => {
      
      if (device['type'] === 'sdm.devices.types.THERMOSTAT') {

        // get relevant info
        const name = device['name'];
        const type = device['type'];
        let location = '';
        const humidity = device['traits']['sdm.devices.traits.Humidity']['ambientHumidityPercent'];
        const connectivity = device['traits']['sdm.devices.traits.Connectivity']['status'];
        const fan = device['traits']['sdm.devices.traits.Fan']['timerMode'];
        const mode = device['traits']['sdm.devices.traits.ThermostatMode']['mode'];
        const thermostatEcoMode = device['traits']['sdm.devices.traits.ThermostatEco']['mode'];
        //const thermostatEcoHeatCelcius = device['traits']['sdm.devices.traits.ThermostatEco']['heatCelsius'];
        //const thermostatEcoHeatFarenheit = convertCtoF(thermostatEcoHeatCelcius);
        //const thermostatEcoCoolCelcius = device['traits']['sdm.devices.traits.ThermostatEco']['coolCelsius'];
        //const thermostatEcoCoolFarenheit = convertCtoF(thermostatEcoCoolCelcius);
        const thermostatHvac = device['traits']['sdm.devices.traits.ThermostatHvac']['status'];
        const tempCelcius = device['traits']['sdm.devices.traits.Temperature']['ambientTemperatureCelsius'];
        const tempFarenheit = convertCtoF(tempCelcius);
        const thermostatSetPoint = device['traits']['sdm.devices.traits.ThermostatTemperatureSetpoint'];
        thermostatSetPointC = null;
        thermostatSetPointF = null;
        if (mode == "COOL") {
          thermostatSetPointC = thermostatSetPoint['coolCelsius'];
        }
        else if (mode == "HEAT") {
          thermostatSetPointC = thermostatSetPoint['heatCelsius'];
        }
        else {// May need to handle heat/cool here....
        }
        thermostatSetPointF = convertCtoF(thermostatSetPointC);

        dataArray.push(
          [
            d,
            name,
            type,
            connectivity,
            fan,
            mode,
            thermostatEcoMode,
            //thermostatEcoHeatCelcius,
            //thermostatEcoHeatFarenheit,
            //thermostatEcoCoolCelcius,
            //thermostatEcoCoolFarenheit,
            thermostatHvac,
            thermostatSetPointC,
            thermostatSetPointF,
            tempCelcius,
            tempFarenheit,
            humidity,
          ].concat(weatherDataArray)
        );
        
        //dataArray = dataArray;

      }

    });
    console.log(dataArray);

    // get the Sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('thermostatLogs');

    // output the data
    sheet.getRange(sheet.getLastRow()+1,1,dataArray.length,dataArray[0].length).setValues(dataArray);
  }
  catch(e) {
    console.log('Error: ' + e);
  }

}


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
    const dewpointC = weatherData['properties']['dewpoint']['value'];
    const dewpointF = convertCtoF(dewpointC);
    const windDirection = weatherData['properties']['windDirection']['value'];
    const windSpeed = weatherData['properties']['windSpeed']['value'];
    const barometricPressure = weatherData['properties']['barometricPressure']['value'];
    const seaLevelPressure = weatherData['properties']['seaLevelPressure']['value'];
    const visibility = weatherData['properties']['visibility']['value'];
    const relativeHumidity = weatherData['properties']['relativeHumidity']['value'];
    const windChill = weatherData['properties']['windChill']['value'];

    // add to array
    weatherArray.push(
      textDescription,
      tempC,
      tempF,
      dewpointC,
      dewpointF,
      windDirection,
      windSpeed,
      barometricPressure,
      seaLevelPressure,
      visibility,
      relativeHumidity,
      windChill
    );
  }
  catch (e) {
    console.log('Error: ' + e);
  }
  console.log(weatherArray);
  
  return weatherArray;

}
