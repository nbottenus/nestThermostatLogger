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
 * Make request to google smart api
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
 * Call Nest API to get current conditions
 */
function retrieveNestData () {
  let dataArray = [];

  // try calling API
  try {
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

    devices.forEach(device => {
      
      if (device['type'] === 'sdm.devices.types.THERMOSTAT') {
        console.log(device);
        
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
            // name,
            // type,
            // connectivity,
            fan,
            mode,
            thermostatEcoMode,
            //thermostatEcoHeatCelcius,
            //thermostatEcoHeatFarenheit,
            //thermostatEcoCoolCelcius,
            //thermostatEcoCoolFarenheit,
            thermostatHvac,
            //thermostatSetPointC,
            thermostatSetPointF,
            //tempCelcius,
            tempFarenheit,
            humidity
        );

      }

    });
  }
  catch(e) {
    console.log('Error: ' + e);
  }
  
  console.log(dataArray);
  return dataArray;
}